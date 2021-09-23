import apiGooglePhotos from '../helpers/google-photos.js';

const _albums = {};

function storeAlbums(albums) {
	if (!albums) return;

	for (const album of albums) {
		_albums[album.id] = album;
	}
}
function forgetAlbums(albums) {
	if (!albums) return;

	for (const mi of albums) {
		delete _albums[mi.id];
	}
}

async function requestList(method, path, body, processResults, pageToken) {
	let url = path;

	if (pageToken) {
		if (method === 'GET') {
			if (!path.endsWith('&') && !path.endsWith('?')) {
				url += (path.indexOf('?') >= 0) ? '&' : '?';
			}

			url += `pageToken=${pageToken}`;
		}
		else {
			body = body || {};
			body.pageToken = pageToken;
		}
	}

	return apiGooglePhotos.request(method, url, body)
		.then(async (results) => {
			await processResults(results);
		});
}

async function runAsync() {
	await requestList('GET', '/albums?pageSize=50', null, async (results) =>
		storeAlbums(results.albums));

	if (Object.keys(_albums).length) {
		const frag = document.createDocumentFragment(),
			  table = document.createElement('table'),
			  tableId = 'tableAlbums';
		
		//const keys = Object.keys(_albums);
		
		Object.values(_albums).forEach(album => 
			const url = album['url'],
				title = album['title'],
				tr = document.createElement('tr');

			tr.innerHTML =
				//`<td>${id}<td>` +
				`<td><a href='${url}' target='_blank'>${title}</a><td>`;

			table.appendChild(tr);	      
		);
		
// 		for (const album in _albums) {
// 			const url = album['url'],
// 			      title = album['title'],
// 				  tr = document.createElement('tr');

// 			tr.innerHTML =
// 				//`<td>${id}<td>` +
// 				`<td><a href='${url}' target='_blank'>${title}</a><td>`;

// 			table.appendChild(tr);
// 		}

		table.id = tableId;
		frag.appendChild(table);

		return frag;
	}
	else return 'No albums found';
}

export default [
	{
		name: 'List albums',
		scopes: 'https://www.googleapis.com/auth/photoslibrary.readonly',

		async run() {
			console.log('listAlbums : running');
			const output = await runAsync();
			console.log('listAlbums : finished');
			return output;
		}
	}
]

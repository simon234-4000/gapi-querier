import apiGooglePhotos from '../helpers/google-photos.js';

const _albums = {};

function storeAlbums(albums) {
	if (!albums) return;

	for (const mi of albums) {
		_albums[mi.id] = mi.productUrl;
	}
}
function forgetAlbums(albums) {
	if (!albums) return;

	for (const mi of albums) {
		delete _albums[mi.id];
	}
}

async function requestPagedRecursively(method, path, body, processResults, pageToken) {
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

			if (results.nextPageToken) {
				return requestPagedRecursively(method, path, body, processResults, results.nextPageToken);
			}
		});
}

async function runAsync() {
	await requestPagedRecursively('GET', '/albums?pageSize=100', null, async (results) =>
		storeAlbums(results.albums));

	await requestPagedRecursively('GET', '/albums?pageSize=50', null, async (results) => {
		if (!results.albums) return;

		for (const a of results.albums) {
			await requestPagedRecursively(
				'POST', '/albums:search', { albumId: a.id, pageSize: 100 },
				async (results) => forgetAlbums(results.albums));
		}
	});

	if (Object.keys(_albums).length) {
		const frag = document.createDocumentFragment(),
			  table = document.createElement('table'),
			  tableId = 'tableFindOutOfAlbumPhotos';

		for (const id in _albums) {
			const url = _albums[id],
				  tr = document.createElement('tr');

			tr.innerHTML =
				//`<td>${id}<td>` +
				`<td><a href='${url}' target='_blank'>${url}</a><td>`;

			table.appendChild(tr);
		}

		table.id = tableId;
		frag.appendChild(table);

		return frag;
	}
	else return 'No out-of-album photos found';
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

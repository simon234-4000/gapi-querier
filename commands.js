//import example from './commands/example.js';
import findOutOfAlbumPhotos from './commands/findOutOfAlbumPhotos.js';
import listAlbums from './commands/listAlbums.js';

export default [

	findOutOfAlbumPhotos,
	listAlbums

].flat(); // Individual commands imports may return arrays of commands, flatten them here.

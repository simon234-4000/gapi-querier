//import example from './commands/example.js';
import findOutOfAlbumPhotos from './commands/findOutOfAlbumPhotos.js';

export default [

	findOutOfAlbumPhotos,
	listAlbums

].flat(); // Individual commands imports may return arrays of commands, flatten them here.

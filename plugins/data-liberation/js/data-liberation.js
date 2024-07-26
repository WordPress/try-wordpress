document.getElementById('start-import').addEventListener('click', function() {
	const progressContainer = document.getElementById('progress-container');
	progressContainer.style.display = 'block';

	const progressBar = document.getElementById('progress-bar');
	const progressText = document.getElementById('progress-text');
	progressBar.style.width = '0%';
	progressText.textContent = 'Progress: 0%';

	window.parent.postMessage( 'start-import', window.location.origin );

	window.addEventListener('message', function(event) {
		if (event.origin !== window.location.origin) return; // Ignore messages from different origins

		if (event.data && typeof event.data.siteTitle ) {
		}

		if (event.data && typeof event.data.total !== 'undefined' && typeof event.data.percent !== 'undefined') {
			const total = event.data.total;
			const percent = event.data.percent;

			// Update progress bar and text
			progressBar.style.width = percent + '%';
			progressText.textContent = 'Progress: ' + percent + '% out of ' + total + '%';

			// Optionally hide progress when complete
			if (percent >= 100) {
				progressText.textContent = 'Import Complete!';
			}
		}
	});
});

window.addEventListener('message', function(event) {
	if (event.origin !== window.location.origin) return; // Ignore messages from different origins

	if (event.data && typeof event.data.siteTitle ) {
		document.getElementById('site-title').value = event.data.siteTitle;
	}
});

<div class="wrap">
	<h1><?php esc_html_e( 'Liberate Your Data', 'try-wordpress' ); ?></h1>
    Site Title:
	<input type="text" id="site-title" value="" disabled /><br/><br/>
	<button id="try-wordpress-import"><?php esc_html_e( 'Start Extraction', 'try-wordpress' ); ?></button>

    <h2><?php esc_html_e( 'Progress', 'try-wordpress' ); ?></h2>

	<div id="progress-container" style="display:none;">
		<div id="progress-bar-container">
         <div id="progress-bar"></div>
        </div>
		<p id="progress-text">0%</p>
	</div>

    <ul id="todo-list">
    </ul>

</div>

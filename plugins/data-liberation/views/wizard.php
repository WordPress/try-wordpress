<div class="wrap">
	<h1><?php esc_html_e( 'Liberate Your Data', 'data-liberation' ); ?></h1>
    Site Title:
	<input type="text" id="site-title" value="" disabled /><br/><br/>
	<button id="data-liberation-import"><?php esc_html_e( 'Start Extraction', 'data-liberation' ); ?></button>

    <h2><?php esc_html_e( 'Progress', 'data-liberation' ); ?></h2>

    <ul id="todo-list">
    </ul>


	<div id="progress-container" style="display:none;">
		<div id="progress-bar-container">
         <div id="progress-bar"></div>
        </div>
		<p id="progress-text">0%</p>
	</div>

    .
</div>

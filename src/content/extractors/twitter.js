export const isTwitter = () => {
	const userId = (document.cookie.split('; ').find(row => row.startsWith('twid=')) || '').split('%3D');
	if ( userId.length > 1 ) {
		return userId[1];
	}
	return false;
};

export const queryTwitterFollowers = ( w ) => {
	document.querySelectorAll('link').forEach( function( el ) {
		if ( el.href.includes('/main.') ) {
			console.log( el.href );
			fetch( el.href ).then(
				response => response.text()
			).then(
				data => {
					console.log( data );
					const r = /queryId:"([^"]+)",operationName:"Followers"/;
					const m = r.exec(data);
					console.log( m );
					if ( m ) {
						const url = 'https://x.com/i/api/graphql/' + m[1] + '/Followers?variables=' + escape(JSON.stringify(
							{
								userId: isTwitter(),
								count:20,
								includePromotedContent:false
							}
						) ) + '&features=' + escape(JSON.stringify(
						{
							"rweb_tipjar_consumption_enabled":true,
							"responsive_web_graphql_exclude_directive_enabled":true,
							"verified_phone_label_enabled":false,
							"creator_subscriptions_tweet_preview_api_enabled":true,
							"responsive_web_graphql_timeline_navigation_enabled":true,
							"responsive_web_graphql_skip_user_profile_image_extensions_enabled":false,
							"communities_web_enable_tweet_community_results_fetch":true,
							"c9s_tweet_anatomy_moderator_badge_enabled":true,
							"articles_preview_enabled":true,
							"tweetypie_unmention_optimization_enabled":true,
							"responsive_web_edit_tweet_api_enabled":true,
							"graphql_is_translatable_rweb_tweet_is_translatable_enabled":true,
							"view_counts_everywhere_api_enabled":true,
							"longform_notetweets_consumption_enabled":true,
							"responsive_web_twitter_article_tweet_consumption_enabled":true,
							"tweet_awards_web_tipping_enabled":false,
							"creator_subscriptions_quote_tweet_preview_enabled":false,
							"freedom_of_speech_not_reach_fetch_enabled":true,
							"standardized_nudges_misinfo":true,
							"tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled":true,
							"rweb_video_timestamps_enabled":true,
							"longform_notetweets_rich_text_read_enabled":true,
							"longform_notetweets_inline_media_enabled":true,
							"responsive_web_enhance_cards_enabled":false
						}
						))
						console.log( {url} );
						fetch(
							url,
							{
								credentials: 'include',
							}
						).then(
							response => response.json()
						).then(
							data => console.log(data)
						);
					}
				}
			);
		}
	} );
};

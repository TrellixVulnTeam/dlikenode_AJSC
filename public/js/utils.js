function getCookie(name) {var cookieArr = document.cookie.split(";");for(var i = 0; i < cookieArr.length; i++) {var cookiePair = cookieArr[i].split("="); if(name == cookiePair[0].trim()) {return decodeURIComponent(cookiePair[1]);} }
    return null;
}
!function(e){e(["jquery"],function(e){return function(){var t,n,s,o=0,i={error:"error",info:"info",success:"success",warning:"warning"},a={clear:function(n,s){var o=u();t||r(o);l(n,o,s)||function(n){for(var s=t.children(),o=s.length-1;o>=0;o--)l(e(s[o]),n)}(o)},remove:function(n){var s=u();t||r(s);if(n&&0===e(":focus",n).length)return void p(n);t.children().length&&t.remove()},error:function(e,t,n){return d({type:i.error,iconClass:u().iconClasses.error,message:e,optionsOverride:n,title:t})},getContainer:r,info:function(e,t,n){return d({type:i.info,iconClass:u().iconClasses.info,message:e,optionsOverride:n,title:t})},options:{},subscribe:function(e){n=e},success:function(e,t,n){return d({type:i.success,iconClass:u().iconClasses.success,message:e,optionsOverride:n,title:t})},version:"2.1.4",warning:function(e,t,n){return d({type:i.warning,iconClass:u().iconClasses.warning,message:e,optionsOverride:n,title:t})}};return a;function r(n,s){return n||(n=u()),(t=e("#"+n.containerId)).length?t:(s&&(t=function(n){return(t=e("<div/>").attr("id",n.containerId).addClass(n.positionClass)).appendTo(e(n.target)),t}(n)),t)}function l(t,n,s){var o=!(!s||!s.force)&&s.force;return!(!t||!o&&0!==e(":focus",t).length)&&(t[n.hideMethod]({duration:n.hideDuration,easing:n.hideEasing,complete:function(){p(t)}}),!0)}function c(e){n&&n(e)}function d(n){var i=u(),a=n.iconClass||i.iconClass;if(void 0!==n.optionsOverride&&(i=e.extend(i,n.optionsOverride),a=n.optionsOverride.iconClass||a),!function(e,t){if(e.preventDuplicates){if(t.message===s)return!0;s=t.message}return!1}(i,n)){o++,t=r(i,!0);var l=null,d=e("<div/>"),f=e("<div/>"),g=e("<div/>"),m=e("<div/>"),h=e(i.closeHtml),v={intervalId:null,hideEta:null,maxHideTime:null},C={toastId:o,state:"visible",startTime:new Date,options:i,map:n};return n.iconClass&&d.addClass(i.toastClass).addClass(a),function(){if(n.title){var e=n.title;i.escapeHtml&&(e=w(n.title)),f.append(e).addClass(i.titleClass),d.append(f)}}(),function(){if(n.message){var e=n.message;i.escapeHtml&&(e=w(n.message)),g.append(e).addClass(i.messageClass),d.append(g)}}(),i.closeButton&&(h.addClass(i.closeClass).attr("role","button"),d.prepend(h)),i.progressBar&&(m.addClass(i.progressClass),d.prepend(m)),i.rtl&&d.addClass("rtl"),i.newestOnTop?t.prepend(d):t.append(d),function(){var e="";switch(n.iconClass){case"toast-success":case"toast-info":e="polite";break;default:e="assertive"}d.attr("aria-live",e)}(),d.hide(),d[i.showMethod]({duration:i.showDuration,easing:i.showEasing,complete:i.onShown}),i.timeOut>0&&(l=setTimeout(T,i.timeOut),v.maxHideTime=parseFloat(i.timeOut),v.hideEta=(new Date).getTime()+v.maxHideTime,i.progressBar&&(v.intervalId=setInterval(D,10))),function(){i.closeOnHover&&d.hover(b,O);!i.onclick&&i.tapToDismiss&&d.click(T);i.closeButton&&h&&h.click(function(e){e.stopPropagation?e.stopPropagation():void 0!==e.cancelBubble&&!0!==e.cancelBubble&&(e.cancelBubble=!0),i.onCloseClick&&i.onCloseClick(e),T(!0)});i.onclick&&d.click(function(e){i.onclick(e),T()})}(),c(C),i.debug&&console&&console.log(C),d}function w(e){return null==e&&(e=""),e.replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/'/g,"&#39;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}function T(t){var n=t&&!1!==i.closeMethod?i.closeMethod:i.hideMethod,s=t&&!1!==i.closeDuration?i.closeDuration:i.hideDuration,o=t&&!1!==i.closeEasing?i.closeEasing:i.hideEasing;if(!e(":focus",d).length||t)return clearTimeout(v.intervalId),d[n]({duration:s,easing:o,complete:function(){p(d),clearTimeout(l),i.onHidden&&"hidden"!==C.state&&i.onHidden(),C.state="hidden",C.endTime=new Date,c(C)}})}function O(){(i.timeOut>0||i.extendedTimeOut>0)&&(l=setTimeout(T,i.extendedTimeOut),v.maxHideTime=parseFloat(i.extendedTimeOut),v.hideEta=(new Date).getTime()+v.maxHideTime)}function b(){clearTimeout(l),v.hideEta=0,d.stop(!0,!0)[i.showMethod]({duration:i.showDuration,easing:i.showEasing})}function D(){var e=(v.hideEta-(new Date).getTime())/v.maxHideTime*100;m.width(e+"%")}}function u(){return e.extend({},{tapToDismiss:!0,toastClass:"toast",containerId:"toast-container",debug:!1,showMethod:"fadeIn",showDuration:300,showEasing:"swing",onShown:void 0,hideMethod:"fadeOut",hideDuration:1e3,hideEasing:"swing",onHidden:void 0,closeMethod:!1,closeDuration:!1,closeEasing:!1,closeOnHover:!0,extendedTimeOut:1e3,iconClasses:{error:"toast-error",info:"toast-info",success:"toast-success",warning:"toast-warning"},iconClass:"toast-info",positionClass:"toast-top-right",timeOut:5e3,titleClass:"toast-title",messageClass:"toast-message",escapeHtml:!1,target:"body",closeHtml:'<button type="button">&times;</button>',closeClass:"toast-close-button",newestOnTop:!0,preventDuplicates:!1,progressBar:!1,progressClass:"toast-progress",rtl:!1},a.options)}function p(e){t||(t=r()),e.is(":visible")||(e.remove(),e=null,0===t.children().length&&(t.remove(),s=void 0))}}()})}("function"==typeof define&&define.amd?define:function(e,t){"undefined"!=typeof module&&module.exports?module.exports=t(require("jquery")):window.toastr=t(window.jQuery)});
var breeze_username=getCookie("breeze_username");


$('.btn_follow_user').click(function() {
    if (breeze_username) {var followName = $(this).attr("data-username");$(".btn_follow_user").html('Following...'); $('.btn_follow_user').attr("disabled", true);
        $.ajax({url: '/follow',type: 'POST',data: JSON.stringify({ followName: followName }),contentType: 'application/json',success: function(data)  {if (data.error == false) {toastr['success']("Followed Successfully!");setTimeout(function(){window.location.reload();}, 300); } else {toastr['error'](data.message);$(".btn_txt_follow").html('Follow');$('.btn_follow_user').attr("disabled", false);return false} } });
    } else { toastr.error('hmm... You must be login!'); return false; }
});

$('.btn_unfollow_user').click(function() {
    if (breeze_username) {var unfollowName = $(this).attr("data-username");$(".btn_unfollow_user").html('UNFollowing...'); $('.btn_unfollow_user').attr("disabled", true);
        $.ajax({url: '/unfollow',type: 'POST',data: JSON.stringify({ unfollowName: unfollowName }),contentType: 'application/json',success: function(data)  {if (data.error == false) {toastr['success']("UNFollowed Successfully!");setTimeout(function(){window.location.reload();}, 300); } else {toastr['error'](data.message);$(".btn_txt_unfollow").html('Following');$('.btn_unfollow_user').attr("disabled", false);return false} } });
    } else { toastr.error('hmm... You must be login!'); return false; }
});

$('.btn_follow_catg').click(function() {
    if (breeze_username) {var catgName = $(this).attr("data-catg");$(this).html('Following...'); $('.btn_follow_catg').attr("disabled", true);
        $.ajax({url: '/followCatg',type: 'POST',data: JSON.stringify({ catgName: catgName }),contentType: 'application/json',success: function(data)  {if (data.error == false) {toastr['success']("Category Subscribed Successfully!");setTimeout(function(){window.location.reload();}, 300); } else {toastr['error'](data.message);$(".btn_txt_catg").html('Follow');$('.btn_follow_catg').attr("disabled", false);return false} } });
    } else { toastr.error('hmm... You must be login!'); return false; }
});

$(".back_btn").click(function (){window.history.back();});
$("#main_login_btn").click(function (){window.location.href = '/welcome';});
$('#logout_btn, #logout_btn_inn').click(function(){$.ajax({type: 'POST',data: JSON.stringify({}),contentType: 'application/json',url: '/logout',success: function(data) {if (data.error == false);toastr['success']("Logout Success");setTimeout(function(){window.location.href = '/';}, 300);} }); })

$('.login_btn').click(function() {
    $(".login_btn").attr('disabled', true);$('#login_txt').html('Login...');
    let login_user = $('#login_user_id').val();let login_pass = $('#login_pass').val();
    if (login_user=="") {toastr.error('phew.. Username should not be empty');$(".login_btn").attr("disabled", false);$('#login_txt').html('Login');return false;}
    if (login_pass=="") {toastr.error('phew... Private key should not be empty');$(".login_btn").attr("disabled", false);$('#login_txt').html('Login');return false;};const pivkey = login_pass;
    $.ajax({type: 'POST',data: JSON.stringify({ pivkey: pivkey,  username: login_user}),contentType: 'application/json',url: '/loginuser',            
        success: function(data) {if (data.error == true) {toastr['error'](data.message);$(".login_btn").attr("disabled", false);$('#login_txt').html('Login');return false;} else {toastr['success']("Login Success");setTimeout(function(){window.location.href = '/';}, 100);}}
    });
});

$('.register_btn').click(function() {$('.login_section').hide(); $('.signup_section').show();});
$('.loginNow_btn').click(function() {$('.signup_section').hide(); $('.login_section').show();});
$('.signin_btn').click(function() {$('.key_section').hide(); $('.login_section').show();});
function accountKeys() {$('.signup_section').hide(); $('.key_section').show();}
$('.signup_btn').click(function() {let input_username = $('#user_name').val();let referrer = $('#refer_by').val();if (input_username=="") {toastr.error('phew.. Username should not be empty');return false;}; $('.signup_txt').html('Creating...'); $('.signup_btn').attr("disabled", true); 
    $.ajax({type: 'POST',data: JSON.stringify({name: input_username, ref: referrer}),contentType: 'application/json',url: '/signup',            
        success: function(data) { if (data.error == true) {toastr['error'](data.message);$('.signup_btn').html('Signup').attr("disabled", false);return false; } else {toastr['success']("Account cteared Successfully!");accountKeys();$('#acct_priv_key').val(data.priv);} }
    })
});

$('.copy_pass').click(function() {var copyText = document.getElementById("acct_priv_key");copyText.select();copyText.setSelectionRange(0, 99999); /* For mobile devices */
    document.execCommand("copy");$('.copy_pass').html('Copied!');toastr['success']("Key copied to clipboard.");return false;
})
function isValidURL(url) {var RegExp = /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/; if (RegExp.test(url)) {return true;} else {toastr.error('phew... Enter a valid url');return false;} }
function getDomain(url) {let hostName = getHostName(url);let domain = hostName;if (hostName != null) {let parts = hostName.split('.').reverse();if (parts != null && parts.length > 1) {domain = parts[1] + '.' + parts[0];if (hostName.toLowerCase().indexOf('.co.uk') != -1 && parts.length > 2) { domain = parts[2] + '.' + domain;}}}else{return false;} return domain;}
function getHostName(url) {var match = url.match(/:\/\/(www[0-9]?\.)?(.[^/:]+)/i); if (match != null && match.length > 2 && typeof match[2] === 'string' && match[2].length > 0) {return match[2];} else {toastr.error('phew... Enter a valid url');return false;}}

$('.share_me').click(function() {
    if (breeze_username) {
        let input_url = $("#url_field").val();
        if (input_url == ''){ $("#url_field").css("border-color", "RED");toastr.error('phew... You forgot to enter URL');$('#share_plus').html('Share');return false;}
        let verifyUrl = getDomain(input_url);
        var sites = ["dlike.io", "wikipedia.org","facebook.com","youtube.com", "pinterest.com","twitter.com","bloomberg.com","youtu.be","pornhub.com","imgur.com","amazon.com","imgbb.com","freepik.com"];
        if(sites.includes(verifyUrl)){toastr.error('Sharing from this URL is not allowed');return false;}
        if (isValidURL(input_url)) {$('#share_plus').html('Sharing...');$(".share_me").attr("disabled", true);
            $.ajax({url: '/share',type: 'POST',data: JSON.stringify({ url: input_url }),contentType: 'application/json',
                success: function(data)  {let title=data.title;let image=data.image;let description=data.description;let url="input_url";
                    if(title !=''){$('.share_link').hide();$('.edit_psot').show(); $('.data-title').html(title);$(".link_image").attr("src", image);$('#domain_name').html(verifyUrl);$('#post_desc').html(description);$('.url_link').val(input_url)} else{toastr.error('Unable to share link'); return false; } }
            });
        } else {toastr.error('phew... URL is not Valid');$('#share_plus').html('Share');$(".share_me").attr("disabled", false);return false;}
    } else { toastr.error('hmm... You must be login!');$('#share_plus').html('Share');$(".share_me").attr("disabled", false); return false; }
});
$('.share_new_post').click(function(clickEvent) {
    if (breeze_username) {
        let urlInput = $('.url_link').val();
        if($('#share_cat').val() == "0") {$('#share_cat').css("border-color", "RED");toastr.error('Please Select an appropriate Category');return false;}
        var inputtags = $.trim($('.share_tags').val()).toLowerCase();let tags=inputtags.replace(/\s\s+/g, ' ');let newtags = $.trim(tags).split(' ');
        if (newtags.length < 2) {$('.tags').css("border-color", "RED");toastr.error('Please add at least two related tags');return false;}
        if (newtags.length > 5) {$('.tags').css("border-color", "RED");toastr.error('maximum 5 tags allowed');return false;}
        var allowed_tags_type = /^[a-z\d\s]+$/i;
        if (!allowed_tags_type.test(tags)) {$('.tags').css("border-color", "RED");toastr.error('Only alphanumeric tags, no Characters.');return false;}
        var post_tags = tags.split(' ');
        var description = $('textarea#post_desc').val();
        var post_description = $.trim(description).split(' ');console.log(post_description.length)
        if (post_description.length < 10) {$('.data-desc').css("border-color", "RED");toastr.error('Please add description of minimum 30 words');return false;}
        if (post_description.length > 82) {$('.data-desc').css("border-color", "RED");toastr.error('Please add description not more than 80 words');return false;}
        var title = $('.data-title').html();
        if (title=="") {toastr.error('Some error in this link!');return false;}
        var post_body = description.replace(/[\u2018\u2019]/g, "'").replace(/[\u201C\u201D]/g, '"');
        var urlImage =  $('.post_img img').attr('src');
        var category = $( "#share_cat option:selected" ).text(); var post_category=category.toLowerCase();
        $(".share_new_post").attr("disabled", true);$('.edit_post_txt').html('Sharing...');
        $.ajax({type: "POST",url: "/post",data: {title: title,tags:post_tags,description:post_body,category: post_category,image:urlImage,exturl:urlInput},
            success: function(data) {console.log(data)
                if (data.error == false) {toastr['success']("Link Shared Successfully!");setTimeout(function(){window.location.href = '/';}, 400);
                } else {toastr['error'](data.message);$(".share_new_post").attr("disabled", false);$('.edit_post_txt').html('Publish');return false}
            },
        });
    } else { toastr.error('hmm... You must be login!'); return false; }
})


$('.likes_section').on("click", ".hov_vote", function() {
    if (breeze_username) {var postLink = $(this).attr("data-permlink");var postAuthor = $(this).attr("data-author");$(this).addClass('hov_ani');
        $.ajax({ type: "POST",url: "/upvote", data: {author: postAuthor, postLink: postLink}, success: function(data) {if (data.error == false) {$('.hov_vote').removeClass('hov_ani').addClass('hov_done');toastr['success']("Upvoted Successfully!");setTimeout(function(){window.location.href = '/';}, 400);} else {$('.hov_vote').removeClass('hov_ani');toastr['error'](data.message);return false}} });
    } else { toastr.error('hmm... You must be login!'); return false; }
});


$('.btn_app_wit').click(function() {
    if (breeze_username != null) {var nodeName = $(this).attr("data-node");$(this).closest("tr").find(".btn_txt_app").html('...');
        $.ajax({url: '/witup',type: 'POST',data: JSON.stringify({ nodeName: nodeName }),contentType: 'application/json', success: function(data)  {if (data.error == false) {toastr['success']("Approved Successfully!");setTimeout(function(){window.location.reload();}, 300);} else {toastr['error'](data.message);$(this).closest("tr").find(".btn_txt_app").html('Approve');return false}} });
    } else { toastr.error('hmm... You must be login!'); return false; }
});

$('.btn_unapp_wit').click(function() {
    if (breeze_username) {var nodeName = $(this).attr("data-node");$(this).closest("tr").find(".btn_txt_unapp").html('...');
        $.ajax({url: '/witunup',type: 'POST',data: JSON.stringify({ nodeName: nodeName }),contentType: 'application/json',success: function(data)  {if (data.error == false) {toastr['success']("UnApproved Successfully!");setTimeout(function(){window.location.reload();}, 300); } else {toastr['error'](data.message);$(this).closest("tr").find(".btn_txt_unapp").html('unapprove');return false} } });
    } else { toastr.error('hmm... You must be login!'); return false; }
});

$('.trans_btn').click(function() {
    if (breeze_username) {$('.trans_txt').html('Transferring...');
        let trans_amount=$("#trans_amount").val();let rec_user=$("#rec_user").val();let memo=$("#trans_memo").val();let trans_bal=$(".trans_bal").html();
        if (rec_user==''){ $("#rec_user").css("border-color", "RED");toastr.error('phew... Enter receiver username');$('.trans_txt').html('Transfer');return false;}
        if ((trans_amount=='') || (trans_amount<1)){ $("#trans_amount").css("border-color", "RED");toastr.error('phew... Enter correct amount');$('.trans_txt').html('Transfer');return false;}
        if (!$.isNumeric(trans_amount)) {toastr.error('phew... Enter valid amount');$('.trans_txt').html('Transfer');return false;}
        $.ajax({url: '/transfer',type: 'POST',data: JSON.stringify({ rec_user: rec_user, trans_amount: trans_amount, memo: memo}),contentType: 'application/json',
            success: function(data)  {if (data.error == false) {toastr['success']("Transferred!");setTimeout(function(){window.location.reload();}, 400); } else {toastr['error'](data.message);$('.trans_txt').html('Transfer');return false;} }
        });
    } else { toastr.error('hmm... You must be login!'); return false; }
});

$('.boost_post_btn').click(function() {
    if (breeze_username) {$('.boost_btn_txt').html('Loading...');
        let boost_amount=$("#boost_amount").val();let boost_url=$("#boost_url").val();
        if (boost_url==''){ $("#boost_url").css("border-color", "RED");toastr.error('phew... Enter URL of POST to Boost');$('.boost_btn_txt').html('Boost');return false;}
        if (!isValidURL(boost_url)) {$("#boost_url").css("border-color", "RED");$('.boost_btn_txt').html('Boost');return false;}
        if ((boost_amount=='')){ $("#boost_amount").css("border-color", "RED");toastr.error('phew... Bid value empty');$('.boost_btn_txt').html('Boost');return false;}
        if (!$.isNumeric(boost_amount)) {toastr.error('phew... Enter valid bid amount');$('.boost_btn_txt').html('Boost');return false;}
        $.ajax({url: '/boost',type: 'POST',data: JSON.stringify({ boost_url: boost_url, boost_amount: boost_amount}),contentType: 'application/json',
            success: function(data)  {if (data.error == false) {toastr['success']("Post Boost Success!");setTimeout(function(){window.location.reload();}, 400); } else {toastr['error'](data.message);$('.boost_btn_txt').html('Boost');return false;} }
        });
    } else { toastr.error('hmm... You must be login!'); return false; }
});

$('.widr_bsc_btn').click(function() {
    if (breeze_username) {$('.widr_btn_txt').html('Loading...');
        let widr_amt=$("#widr_amt").val();let wid_address=$("#bsc_address").val();
        if (wid_address==''){ $("#bsc_address").css("border-color", "RED");toastr.error('phew... Enter your bsc address');$('.widr_btn_txt').html('Withdraw');return false;}
        if ((widr_amt=='')){ $("#widr_amt").css("border-color", "RED");toastr.error('phew... Withdraw amount missing');$('.widr_btn_txt').html('Withdraw');return false;}
        if (!$.isNumeric(widr_amt)) {toastr.error('phew... Enter valid withdraw amount');$('.widr_btn_txt').html('Withdraw');return false;}
        $.ajax({url: '/withdraw',type: 'POST',data: JSON.stringify({ wid_addr: wid_address, wid_amount: widr_amt}),contentType: 'application/json',
            success: function(data)  {if (data.error == false) {toastr['success']("Withdrawal Initiated Successfully!");setTimeout(function(){window.location.reload();}, 400); } else {toastr['error'](data.message);$('.widr_btn_txt').html('Withdraw');return false;} }
        });
    } else { toastr.error('hmm... You must be login!'); return false; }
});
$('.keys_gen_btn').click(function() {
    if (breeze_username) {$('.gen_btn_txt').attr("disabled", true).html('Generating...');
        $.ajax({url: '/keys',type: 'POST',data: JSON.stringify({ user: breeze_username}),contentType: 'application/json',
            success: function(data)  {
                if (data.error == true) {toastr['error'](data.message);$('.gen_btn_txt').attr("disabled", false).html('Generate New Keys');return false;
                } else {$('#gen_pub').val(data.pub);$('#gen_priv').val(data.priv);$(".modal-gen").show();toastr['success']("Keys generated Successfully!"); }}
        });
    } else { toastr.error('hmm... You must be login!'); return false; }
});
const show_categories = () => {$('#explore_cat_trends').hide();$('#explore_trends').removeClass('activeTab'); $('#explore_cat_content').show();$('#explore_categories').addClass('activeTab'); }
const show_trends = () => {$('#explore_cat_content').hide();$('#explore_categories').removeClass('activeTab'); $('#explore_cat_trends').show();$('#explore_trends').addClass('activeTab');}
$('#explore_categories, #sidebar_categories').click(function() {show_categories();});
$('#explore_trends, sidebar_trends').click(function() {show_trends();});

$('#moremenu').click(function() { $('.more-menu-background').toggle();});
$('#uiModeChange').on('click', function(){ $('body').toggleClass('dark_mode'); })
let darkMode = localStorage.getItem('darkMode');
const darkModeToggle = document.getElementById('uiModeChange');
const enableDarkMode = ()=>{ document.querySelector('body').classList.add('dark_mode'); localStorage.setItem('darkMode', 'enabled')}
const disableDarkMode = ()=>{ document.querySelector('body').classList.remove('dark_mode'); localStorage.setItem('darkMode',null) }
if(darkMode === 'enabled') {enableDarkMode();}
darkModeToggle.addEventListener('click', ()=> { darkMode = localStorage.getItem('darkMode'); if(darkMode !== 'enabled') { enableDarkMode(); } else { disableDarkMode() } })

$('#transfer_btn').click(function(e) {  e.preventDefault();$(".modal-transfer").show();});
$(".modal-closeIcon-wrap").click(function(){$(".modal-transfer").hide();});
$('.boost_btn').click(function(e) {  e.preventDefault();$(".modal-boost").show();});
$(".gen-close").click(function(){$(".modal-gen").hide();setTimeout(function(){window.location.reload();}, 100);});
$(".boost-close").click(function(){$(".modal-boost").hide();});
$('.withd_btn').click(function(e) {  e.preventDefault();$(".modal-widr").show();});
$(".widr-close").click(function(){$(".modal-widr").hide();});
$('#profile_likes').hide();
$('.likes_tab').on('click', function() { $('.likes_tab').addClass('activeTab'); $('.posts_tab').removeClass('activeTab'); $('#profile_posts').hide(); $('#profile_likes').show(); });
$('.posts_tab').on('click', function() {$('.posts_tab').addClass('activeTab'); $('.likes_tab').removeClass('activeTab'); $('#profile_likes').hide(); $('#profile_posts').show(); });
$('#profile_edit').click(function(e) {  e.preventDefault();$(".modal-profile").show();});
$(".modal-closeIcon-wrap").click(function(){$(".modal-profile").hide();});
$('.prof_edit_btn').click(function() { 
    $(".prof_edit_btn").attr("disabled", true).html('updating'); 
    let p_about=$('#profile_about').val();
    let p_website = $('#profile_website').val(); 
    let p_location = $('#profile_location').val();
    let p_cover_img = $('#cover_img').val();
    let p_img = $('#profile_img').val(); 
    if(!p_img){toastr.error('Profile avatar must not be empty');return false;}
    if ((p_website) && (!isValidURL(p_website))) {toastr.error('Enter valid website address');return false;}

    $.ajax({url: '/pupdate', type: 'post',contentType: 'application/json', data: JSON.stringify({ acc_about:p_about, acc_website:p_website, acc_location:p_location, acc_cover_img:p_cover_img, acc_img:p_img }), success: function(data) { if (data.error == true) {toastr['error'](data.message);$(".prof_edit_btn").attr("disabled", false).html('save');return false; } else {$(".modal-profile").hide();toastr['success']("updated Successfully!");setTimeout(function(){window.location.reload();}, 500);} } }); });
switch(nav_val){case"home":case"wallet":case"notic":case"feed":case"profile":case"reward":case"staking":case"mining":case"witnesses":case"explorer":case"help":var item;(item=document.getElementById(nav_val)).classList.add("active-Nav")}
$('.trans_tab').on('click', function() { $('.trans_tab').addClass('activeTab'); $('.keys_tab').removeClass('activeTab'); $('#keys_sec').hide(); $('#trans_sec').show(); });
$('.keys_tab').on('click', function() {$('.keys_tab').addClass('activeTab'); $('.trans_tab').removeClass('activeTab'); $('#trans_sec').hide(); $('#keys_sec').show(); });

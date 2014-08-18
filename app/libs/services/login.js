/**
 * Created by solomon on 14-8-12.
 */


// TODO: 需要定期refresh功能，保证cookie不会失效
exports.loginMothership = function(config,callback){
    var j = request.jar();
    var r = request({method:'POST',url:config.mothership_url+'/login',jar:j}, function(err, httpResponse, body) {
        if(err) {
            callback(err);
        }else{
            if (httpResponse.statusCode != 200) {
                callback(body);
            }else{
                var cookie_string = j.getCookieString(config.mothership_url+'/login');
                var cookies = j.getCookies(config.mothership_url+'/login');
                global.mothership_cookie = cookie_string;
                console.log('[LoginService]: Login mothership server succeed!');
                callback(null);
            }
        }
    });
    var form = r.form();
    form.append('username', 'admin1');
    form.append('password', 'xiaoshu815');
};
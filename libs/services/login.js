/**
 * Created by solomon on 14-8-12.
 */

exports.loginMothership = function(callback){
    var j = request.jar();
    var r = request({method:'POST',url:'http://localhost:3000/login',jar:j}, function(err, httpResponse, body) {
        if(err) {
            callback(err);
        }else{
            if (httpResponse.statusCode != 200) {
                callback(body);
            }else{
                var cookie_string = j.getCookieString('http://localhost:3000/login');
                var cookies = j.getCookies('http://localhost:3000/login');
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
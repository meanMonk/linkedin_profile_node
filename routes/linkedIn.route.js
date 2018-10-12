var express = require('express');
var router = express.Router();
var Linkedin = require('node-linkedin')('<client_id>', '<client_secrete>', 'callback');
var scope = ['r_basicprofile', 'r_emailaddress'];
let clientUrl;
let linkedin;
/* GET users listing. */
router.get('/', function (req, res, next) {
    var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    res.send({
        sampleApiLink: fullUrl
    });
});

router.post('/oauth/linkedin', (req, res) => {
    clientUrl = req.body.public_url || req.query.public_url || 'no url';
    /*setting callback url*/
    Linkedin.setCallback(req.protocol + '://' + req.headers.host + '/api/oauth/linkedin/callback');
    Linkedin.auth.authorize(res, scope);
});


/**
 * Requesting an Access Token
 * */
router.get('/oauth/linkedin/callback', (req, res) => {

    Linkedin.auth.getAccessToken(res, req.query.code, req.query.state, function(err, results) {
        if ( err )
            return console.error(err);

        linkedin = Linkedin.init(results.access_token);
        let projection = [
            'id', 'first-name', 'last-name', 'headline', 'phoneticFirstName', 'phoneticLastName',
            'profilePicture',
            'positions',
            'specialties',
            'summary',
            'industryId',
            'location'
        ];
        linkedin.people.url(clientUrl, projection, (err, $in) => {
            if(err) {
                return res.send(err)
            } else {
                return res.send({
                    $in
                });
            }
        });
    });
});

module.exports = router;

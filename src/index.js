(function () {

    'use strict';

    var
        router = require('router'),
        appData = require('appData'),
        fileUtil = require('FileUtil'),
        constants = require('/module/common/AppConstants'),

        logUtil = require('LogUtil');

    router.get('/', function (req, res) {

        res.render('/', {
        });
    });

    router.get('/doAddressSearch', function (req, res) {

        var keysContent = appData.getNode('keys'),
            keysContentAsString = fileUtil.getContentAsString(keysContent, 'UTF-8'),
            keysJSON = JSON.parse(keysContentAsString),
            searchString = req.params.searchString,
            addresses = [],
            counter = 0,
            value;

        if (searchString) {

            searchString = searchString.toLowerCase();

            for (var key in keysJSON) {

                value = keysJSON[key];

                if (value.toLowerCase().indexOf(searchString) > -1) {
                    addresses.push(value);
                    counter++;
                }

                if (counter > 9) {
                    break;
                }
            }
        }

        res.json({
            success: true,
            addresses: addresses
        });
    });

    router.get('/getAddressData', function (req, res) {

        var allDataContent = appData.getNode('allData'),
            allDataContentAsString = fileUtil.getContentAsString(allDataContent, 'UTF-8'),
            allDataJSON = JSON.parse(allDataContentAsString),
            clickedValue = req.params.clickedValue,
            returnable;

        if (clickedValue) {
            returnable = allDataJSON[clickedValue];
        } else {
            returnable = {};
        }

        res.json({
            success: true,
            data: returnable
        });
    });

}());
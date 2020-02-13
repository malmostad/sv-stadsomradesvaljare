define(function (require) {
    'use strict';

    var
        _ = require('underscore'),
        store = require('store'),
        jq = require('jquery'),
        router = require('router'),
        requester = require('requester'),
        Component = require('Component'),
        template = require('/template/search');

    return Component.extend({

        template: template,

        handleStoreUpdate: function (newState) {
            this.setState(newState);
        },

        doAddressSearch: function (e) {

            var target = jq(e.target),
                input = target.val(),
                resultList = jq('.af-stadsomradesvaljare-resultList'),
                resultListContainer = resultList.parent();

            if (input.length > 2) {

                requester.doGet({
                    url: router.getStandaloneUrl('/doAddressSearch'),
                    data: {
                        searchString: input
                    }
                })
                    .done(function (response) {

                        if (response.success) {

                            resultListContainer.show();
                            resultList.empty();

                            jq.each(response.addresses, function (i, address) {

                                jq('<li />', {
                                    text: address,
                                    class: 'af-stadsomradesvaljare-resultList--item'
                                }).appendTo(resultList);
                            });
                        }

                    })
                    .fail(function (response) {
                        resultListContainer.hide();
                    });

            } else {
                resultListContainer.hide();
            }
        },

        resolveAddress: function (e) {

            var clickedElem = jq(e.target),
                clickedElemParent = clickedElem.closest('.af-stadsomradesvaljare-result'),
                clickedValue = clickedElem.text(),
                searchField = jq('input[name="adress"]');

            searchField.val(clickedValue);
            clickedElemParent.hide();

            requester.doGet({
                url: router.getStandaloneUrl('/getAddressData'),
                data: {
                    clickedValue: clickedValue
                }
            })
                .done(function (response) {

                    var detailHolder = jq('.af-stadsomradesvaljare-details'),
                        data = response.data,
                        row, cell1, cell2, value;

                    detailHolder.empty();

                    if (response.success && data) {

                        for (var key in data) {

                            row = jq('<div />', {
                                class: 'env-d--flex'
                            });

                            value = data[key];

                            cell1 = jq('<div />', {
                                text: key,
                                class: 'env-flex-length--1'
                            });

                            cell2 = jq('<div />', {
                                text: value,
                                class: 'env-flex-length--2'
                            });

                            row.append(cell1);
                            row.append(cell2);

                            detailHolder.append(row);
                        }
                    }
                })
                .fail(function (response) {

                });

        },

        events: {
            dom: {
                'keyup input[name="adress"]': 'doAddressSearch',
                'click .af-stadsomradesvaljare-resultList--item': 'resolveAddress'
            },
            self: {
                'state:changed': 'render'
            },
            store: 'handleStoreUpdate'
        },

        filterState: function (state) {
            return _.extend({}, state);
        }
    });
});
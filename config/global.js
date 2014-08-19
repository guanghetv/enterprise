/**
 * Created by solomon on 14-8-1.
 */

global._ = require('underscore');
global.sync = require('synchronize');
global.async = require('async');
global.request = require('request');
global.important = '-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-';
global.Utils = {
    haveEssentialVariables:function(args){
        var ret = true;
        _.each(args,function(arg){
            if(arg ==undefined){
                ret = false;
                console.error();
                return ret;
            }
        });
        return ret;
    },

    deleteMultiElementsFromArrayAtOnce:function(originArray,shouldBeRemovedIndexArray){

        var newArray = _.filter(originArray,function(item){

            var shouldBeRemoved = _.contains(shouldBeRemovedIndexArray,_.indexOf(originArray,item));

            return !shouldBeRemoved;
        });

        return newArray;
    }
};
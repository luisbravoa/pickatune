var _ = require('underscore');
var when = require('when');
var utils = require('../misc/utils');
var fs = require('fs');


module.exports  = global.bookshelf.Model.extend({
  tableName: 'songs',
  add: function(data){
    var self = this;
      
    return self.set(data)
          .save()
      .then(function(model){
        return self.addImages(files);
      })
      .catch(function(e){
        return when.reject(e);
      });
  },
  edit: function(id, data){
    var self = this;
    var data = _.omit(data, ['id', 'user_id']);

    return self.set({id: id})
      .fetch()
      .then(function(app){
        if(!app){
          return when.reject(new Error('Song does not exists.'));
        }
        self.set(data);
        return self.save()
          .then(function(model){
            return when.resolve(self);
          })
      })
      .catch(function(e){
        return when.reject(e);
      });
  },
  search: function(options){
    var self = this;
    var total;
    var offset = 0;
    var page = (options.page)?options.page:1;
    var search = (options.query)?options.query.toLowerCase():null;
    var limit = (options.limit)?options.limit:15;
    var orderBy = (options.orderBy)?options.orderBy:'id';
    var orientation = (options.orientation)?options.orientation:'DESC';



    var query = "select count(*) from bugs ";



    if(search !== null){
      var termArray = search.split(" ");
      var where = "title ILIKE '%" + search + "' OR description ILIKE '%" + search + "' ";
      for (var i = 0; i < termArray.length; i++) {
        if (termArray[i].length > 1) {
          where += "OR title ILIKE '%" + termArray[i] + "%' OR description ILIKE '%" + termArray[i] + "%' ";
        }
      }
      query += "where " + where;
    }else{
      where = '';
    }



    return global.bookshelf.knex.raw(query)
      .then(function(result){
        total = result.rows[0].count;
        if(limit == 0 ){
          total_pages = 1;
        }else{
          total_pages = Math.ceil(total / limit);
          offset = (page - 1) * limit;
        }
        return when.resolve(self);
      })
      .then(function(){
        try{
          return global.models.Bug.collection()
            .query(function(qb) {
              if(search){
                qb.whereRaw(where);
              }
              qb.limit(options.limit).offset(offset).orderBy(orderBy, orientation);
            })
            .fetch({withRelated: ['Files', 'Application', 'Environment']})
        }catch (e){
          console.log(e);
        }

      })

      .then(function(data){

        var response = {};
        response.total_pages = total_pages;
        response.page = page;
        response.limit = limit;
        response.data = data;
        return when.resolve(response);
      });

  },

  initialize: function() {
  }
});
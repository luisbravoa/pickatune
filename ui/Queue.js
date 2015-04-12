function Queue(){
    this.queue = [];

}

Queue.prototype.add = function(item){
    return this.queue.push(item);
};


Queue.prototype.getNext = function(){
    if(this.queue.length > 0){
        return this.queue.splice(0, 1)[0];
    }
};
Queue.prototype.getSongs = function(){
    return this.queue;
};
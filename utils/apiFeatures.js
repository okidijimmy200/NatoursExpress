class APIFeatures {
    constructor(query, queryString){
        this.query = query;
        this.queryString = queryString
    }
    filter() {
        const queryObj= {...this.queryString}
        // array of fields to exclude
        const excludedFields= ['page', 'sort', 'limit', 'fields']
        // --removing fields from queryObj
        excludedFields.forEach(el => delete queryObj[el])

        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
        this.query = this.query.find(JSON.parse(queryStr));
       return this;
    }
    sort() {
        if(this.queryString.sort) {
            const sortBy = this.queryString.sort.split(',').join(' ')
            this.query = this.query.sort(sortBy)
            // --sorting according to 2 different fields
            // sort('price ratingsAverage')
        }
        // --setting a default 
        else {
            // --sorting according to created last
            this.query = this.query.sort('-createdAt')
        }
        return this;
    }

    limitFields(){
        if (this.queryString.fields) {
            const fields = this.queryString.fields.split(',').join(' ')
            // --this expects string like name, duration and price and will return only that
           this.query =this.query.select('name duration price')
        }
        // --setting the default
        else {
            // --excluding items we dont want
           this.query =this.query.select('-__v')
        }
        return this;
    }
    paginate() {
        const page = this.queryString.page * 1 || 1
        const limit = this.queryString.limit * 1 || 100
        const skip = (page -1) * limit
        this.query = this.query.skip(skip).limit(limit)
    
        // if (req.query.page) {
        //     const numTours = await Tour.countDocuments()
        //     if (skip >= numTours) throw new Error('This page dosenot exist')
        // }
        return this;
    }
}

module.exports = APIFeatures
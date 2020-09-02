
import { connect } from 'mongoose'

connect('mongodb://127.0.0.1:27017/claymore', function (error) {
    if (error) {
        console.log('db error main', error);
    }
});

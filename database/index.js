const mongoose=require('mongoose');

mongoose.connect('mongodb://localhost/dyma', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
}).then(()=>{
    console.log('Connexion Ok !');
}).catch(err=>{
    console.log(err);
})
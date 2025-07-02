import mongoose from 'mongoose';

const LeadFileSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true
    },
    total:{
        type:Number,
        required:true
    },
    assigned:{
        type:Number,
        required:true
    },
    unAssigned:{
        type:Number,
        required:true
    },
    closed:{
        type:Number,
        default:0
    }
}, {timestamps:true})


const LeadFile = mongoose.model("LeadFile", LeadFileSchema)

export default LeadFile
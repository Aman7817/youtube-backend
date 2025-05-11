import mongoose,{Schema} from "mongoose";

const subsciptionSchema = new Schema({
    subcriber:{
        type: Schema.Types.ObjectId,
        ref: "User"
    },

    channelId: {
        type: Schema.Types.ObjectId,
        ref: "User",
    }

},{timestamps: true});




export const Subciption = mongoose.model("Subciption", subsciptionSchema)

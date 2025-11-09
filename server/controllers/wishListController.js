const wishListModel = require('../models/WishList');

class wishListController {
  static getUsersWishList = async (req, res) => {
    try {
      const id = req.params.id;
      const wishlist = await wishListModel.find({ userId: id });
      res.json({ wishlist }); // always respond as { wishlist: [...] }
    } catch (error) {
      res.status(500).json({ message: `Server error: ${error}` });
    }
  };

  static add = async (req, res) => {
    try {
      const body = req.body;
      const checkReplication=await wishListModel.findOne({propertyId:body.propertyId,userId:body.userId})
      if(checkReplication){
        return res.status(400).json({
          message:"Already wishlisted"
        })
      }
      const wishListItem = await wishListModel.create(body);
      // After adding, send back the whole wishlist for the user
      const wishlist = await wishListModel.find({ userId: body.userId });
      res.json({
        wishlist,
        message: "success",
      });
    } catch (error) {
      res.status(500).json({ message: `Server error: ${error}` });
    }
  };

  static remove = async (req, res) => {
    try {
      const {userId,propertyId} = req.params
      // console.log(userId,propertyId)
      const removedWish = await wishListModel.findOneAndDelete({propertyId:propertyId,userId:userId});
      if (removedWish) {
        const wishlist = await wishListModel.find({ userId: removedWish.userId });
        res.json({ wishlist, message: "success" });
      } else {
        res.status(404).json({ message: "Item not found" });
      }
    } catch (error) {
      res.status(500).json({ message: `Server error: ${error}` });
    }
  };
}

module.exports = wishListController;

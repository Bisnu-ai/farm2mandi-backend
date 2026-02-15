const MarketPrice = require('../models/MarketPrice');

// @desc    Get all market prices
// @route   GET /api/market-prices
// @access  Public
const getMarketPrices = async (req, res) => {
  try {
    const { category, productName, location } = req.query;
    
    let query = {};

    if (category) {
      query.category = category;
    }

    if (productName) {
      query.productName = { $regex: productName, $options: 'i' };
    }

    if (location) {
      query['location.city'] = { $regex: location, $options: 'i' };
    }

    const marketPrices = await MarketPrice.find(query)
      .sort({ date: -1 });

    res.status(200).json({
      success: true,
      count: marketPrices.length,
      data: marketPrices
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get latest market prices by category
// @route   GET /api/market-prices/latest
// @access  Public
const getLatestMarketPrices = async (req, res) => {
  try {
    const marketPrices = await MarketPrice.aggregate([
      {
        $sort: { date: -1 }
      },
      {
        $group: {
          _id: '$productName',
          latestPrice: { $first: '$$ROOT' }
        }
      },
      {
        $replaceRoot: { newRoot: '$latestPrice' }
      },
      {
        $sort: { category: 1, productName: 1 }
      }
    ]);

    res.status(200).json({
      success: true,
      count: marketPrices.length,
      data: marketPrices
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Create market price
// @route   POST /api/market-prices
// @access  Private (Admin only)
const createMarketPrice = async (req, res) => {
  try {
    const {
      productName,
      category,
      minPrice,
      maxPrice,
      avgPrice,
      unit,
      location,
      source
    } = req.body;

    const marketPrice = await MarketPrice.create({
      productName,
      category,
      minPrice,
      maxPrice,
      avgPrice,
      unit,
      location,
      source
    });

    res.status(201).json({
      success: true,
      message: 'Market price created successfully',
      data: marketPrice
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get market price trends
// @route   GET /api/market-prices/trends/:productName
// @access  Public
const getMarketPriceTrends = async (req, res) => {
  try {
    const { productName } = req.params;
    const { days = 30 } = req.query;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const trends = await MarketPrice.find({
      productName: { $regex: productName, $options: 'i' },
      date: { $gte: startDate }
    })
      .sort({ date: 1 })
      .select('productName avgPrice minPrice maxPrice date location');

    res.status(200).json({
      success: true,
      count: trends.length,
      data: trends
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

module.exports = {
  getMarketPrices,
  getLatestMarketPrices,
  createMarketPrice,
  getMarketPriceTrends
};
import { RestaurantCategory } from '../models/models.js'
const index = async function (req, res) {
  try {
    const restaurantCategories = await RestaurantCategory.findAll()
    res.json(restaurantCategories)
  } catch (err) {
    res.status(500).send(err)
  }
}
const RestaurantCategoryController = {
  index
}

// SOLUCION
// Función para crear una nueva categoría
const create = async function (req, res) {
  const newCategory = RestaurantCategory.build(req.body)
  try {
  const restaurantCategories = await newCategory.save()
  res.json(restaurantCategories)
  } catch (err) {
  res.status(500).send(err)
  }
  }
export default RestaurantCategoryController

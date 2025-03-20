import { check } from 'express-validator'
import { checkFileIsImage, checkFileMaxSize } from './FileValidationHelper.js'
const maxFileSize = 2000000 // around 2Mb

// SOLUCION
const checkCategoryExists = async (value, { req }) => {
  try {
    const category = RestaurantCategory.findOne({ where: { name: value
  } })
    if (!category) {
      return Promise.resolve('Category succesfully created')
  } else {
     return Promise.reject(new Error('Restaurant category succesfully created'))
    }
  } 
  catch (err) {
    return Promise.reject(new Error(err))
  }
}

const create = [
  check('name').custom(checkCategoryExists),
  // El tamaño máximo para los nombres de las categorías de restaurante será de 50 caracteres
  // SOLUCION
  check('name').exists().isString().isLength({ min: 1, max: 50 })
  .trim()]

export { create }
    
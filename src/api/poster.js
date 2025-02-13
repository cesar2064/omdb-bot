'use strict'

const Wreck = require('@hapi/wreck')
const Joi = require('@hapi/joi')

let posterCall = async (api, title) => {
  const { res: ombdres, payload: ombdpayload } = await Wreck.get(`http://www.omdbapi.com/?apikey=${api}&t=${title}`);
  const imdbID = ombdpayload.imdbID;
  const { req, res, payload } = await Wreck.get(`http://img.omdbapi.com/?apikey=${api}&i=${imdbID}`)
  return payload
}

const plugin = {
  name: 'poster',
  version: '0.1.0',
  register: (server, options) => {
    server.route({
      method: ['GET', 'PUT', 'POST'],
      path: '/api/poster/{title?}',
      config: {
        validate: {
          params: {
            title: Joi.string().required()
          }
        }
      },
      handler: async (request, h) => {
        let findPoster
        try {
          findPoster = await posterCall(process.env.API_KEY, request.params.title)
        } catch (err) {
          console.error(err)
        }
        return h.response(findPoster).type('image/jpeg')
      }
    })
  }
}

module.exports = plugin

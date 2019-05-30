const { GraphQLObjectType, GraphQLInt, GraphQLBoolean, GraphQLString, GraphQLList, GraphQLSchema, GraphQLFloat } = require('graphql');
const axios = require('axios');

const MainWeatherType = new GraphQLObjectType({
    name: 'MainWeatherType',
    fields: () => ({
        cod: { type: GraphQLString },
        message: { type: GraphQLFloat },
        cnt: { type: GraphQLInt },
        list: { type: new GraphQLList(TestType) },
    }),
});

const TestType = new GraphQLObjectType({
    name: 'Test',
    fields: () => ({
        dt: { type: GraphQLInt },
        main: { type: MainType },
        weather: {
            type: new GraphQLList(new GraphQLObjectType({
                name: 'Weather',
                fields: () => ({
                    description: { type: GraphQLString }
                })
            }))
        }
    })
});

const MainType = new GraphQLObjectType({
    name: 'Main',
    fields: () => ({
        temp: { type: GraphQLFloat }
    })
});






const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: () => ({
        weather: {
            type: MainWeatherType,
            args: {
                city: { type: GraphQLString },
                country: { type: GraphQLString }, 
            },
            resolve(parent, args) { 
                const { city, country } = args;
                return axios.get(`https://api.openweathermap.org/data/2.5/forecast?appid=f7ce251f6306342154424bc96c455845&q=${city},${country}`)
                    .then(res => res.data);
            }
        }
    })
});

module.exports = new GraphQLSchema({
    query: RootQuery
});




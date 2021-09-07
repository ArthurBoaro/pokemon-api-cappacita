const { databaseConnection } = require('./connection')

async function salvarPokemons(pokemon) {
    const queryInsertPokemon = `INSERT INTO pokemon.pokemons(nome_pokemon, tipo, local_origem, fraqueza, resistencia, hp) VALUES ('${pokemon.nome}', '${pokemon.tipo}', '${pokemon.origem}', '${pokemon.fraqueza}', '${pokemon.resistencia}', '${100}')`
    const result = await databaseConnection.raw(queryInsertPokemon)
    if(result){
        return {
            ...pokemon,
            id: result[0].insertId
        }
    } else {
        console.error("Error!")
        return {
            error: "Deu erro na insercao"
        }
    }
}

async function mostrarPokemon(id) {
    const querySelectPokemon = `SELECT * FROM pokemon.pokemons WHERE id = ${id}`

    const result = await databaseConnection.raw(querySelectPokemon)

    return result[0]
}

async function mostrarPokemons() {
    const querySelectPokemon = `SELECT * FROM pokemon.pokemons`

    const result = await databaseConnection.raw(querySelectPokemon)

    return result[0]
}

async function atualizarPokemon(id, pokemon){
    
    const updatePokemon = {
        nome_pokemon: pokemon.nome,
        tipo: pokemon.tipo,
        local_origem: pokemon.origem,
        fraqueza: pokemon.fraqueza,
        resistencia: pokemon.resistencia,
        HP: 100
    }
    console.log(updatePokemon.tipo)
    const queryUpdatePokemon = `UPDATE pokemon.pokemons SET nome_pokemon = '${updatePokemon.nome_pokemon}', tipo = '${updatePokemon.tipo}', local_origem = '${updatePokemon.local_origem}', fraqueza = '${updatePokemon.fraqueza}', resistencia = '${updatePokemon.resistencia}', hp = ${updatePokemon.HP} WHERE id = ${id}`

    const result = await databaseConnection.raw(queryUpdatePokemon)

    if(result){
        return {
            ...pokemon,
            id
        }
    } else {
        console.error("Error!")
        return {
            error: "Deu erro na atualizacao"
        }
    }
}

async function deletarPokemon(id) {
    const queryDeletePokemon = `DELETE FROM pokemon.pokemons WHERE id=${id}`

    const result = await databaseConnection.raw(queryDeletePokemon)

    return result[0]
}

async function batalhaPokemon(id1, id2){
    const superEfetivo = 40
    const efetivo = 20
    const naoEfetivo = 10

    const querySelectPokemon1 = `SELECT * FROM pokemon.pokemons WHERE id = ${id1}`
    const querySelectPokemon2 = `SELECT * FROM pokemon.pokemons WHERE id = ${id2}`
    const pokemon1 = await databaseConnection.raw(querySelectPokemon1)
    const pokemon2 = await databaseConnection.raw(querySelectPokemon2)

    if(pokemon1[0][0].hp != 0 && pokemon2[0][0].hp != 0){
        if(pokemon1[0][0].tipo == pokemon2[0][0].fraqueza){
            pokemon2[0][0].hp = pokemon2[0][0].hp - superEfetivo
        } else if (pokemon1[0][0].tipo == pokemon2[0][0].resistencia){
            pokemon2[0][0].hp = pokemon2[0][0].hp - naoEfetivo
        } else{
            pokemon2[0][0].hp = pokemon2[0][0].hp - efetivo
        }
    }

    if(pokemon1[0][0].hp != 0 && pokemon2[0][0].hp != 0){
        if(pokemon2[0][0].tipo == pokemon1[0][0].fraqueza){
            pokemon1[0][0].hp = pokemon1[0][0].hp - superEfetivo
        } else if (pokemon2[0][0].tipo == pokemon1[0][0].resistencia){
            pokemon1[0][0].hp = pokemon1[0][0].hp - naoEfetivo
        } else{
            pokemon1[0][0].hp = pokemon1[0][0].hp - efetivo
        }
    }

    if(pokemon1[0][0].hp < 0) pokemon1[0][0].hp = 0
    if(pokemon2[0][0].hp < 0) pokemon2[0][0].hp = 0

    const queryUpdatePokemon1 = `UPDATE pokemon.pokemons SET hp = ${pokemon1[0][0].hp} WHERE id = ${id1}`
    const queryUpdatePokemon2 = `UPDATE pokemon.pokemons SET hp = ${pokemon2[0][0].hp} WHERE id = ${id2}`
    const result1 = await databaseConnection.raw(queryUpdatePokemon1)
    const result2 = await databaseConnection.raw(queryUpdatePokemon2)


    return `O pokemon ${pokemon1[0][0].nome_pokemon} ficou com ${pokemon1[0][0].hp} de HP.\n O pokemon ${pokemon2[0][0].nome_pokemon} ficou com ${pokemon2[0][0].hp} de HP.`

}

async function curarPokemon(id){
    const querySelectPokemon = `SELECT * FROM pokemon.pokemons WHERE id = ${id}`

    const pokemon = await databaseConnection.raw(querySelectPokemon)
    pokemon[0][0].hp = pokemon[0][0].hp + 20
    const queryUpdatePokemon = `UPDATE pokemon.pokemons SET hp = ${pokemon[0][0].hp} WHERE id = ${id}`

    if(pokemon[0][0].hp > 100) {
        pokemon[0][0].hp = 100
        const result = await databaseConnection.raw(queryUpdatePokemon)
        return `O ${pokemon[0][0].nome_pokemon} foi totalmente curado e agora está com vida cheia (${pokemon[0][0].hp} HP), portanto não é mais possível curá-lo.`
    } else {
        const result = await databaseConnection.raw(queryUpdatePokemon)
        return `O ${pokemon[0][0].nome_pokemon} foi curado em 20 de HP com uma poção e agora está com ${pokemon[0][0].hp} HP.`
    }

}



module.exports = { salvarPokemons, mostrarPokemon, mostrarPokemons, atualizarPokemon, deletarPokemon, batalhaPokemon, curarPokemon }
'use strict';
import React, {Componet} from 'react';
import ReactDom from 'react-dom';
import falcor from 'falcor';
const Immutable = require('immutable');
const $ref = falcor.Model.ref;
const $atom = falcor.Model.atom;
const _ = require('lodash');

const model = new falcor.Model({
  
  cache: {
    ingrediesById: {
      "1": {
        name: 'flour',
        description: 'white and powdery',
        inventor: 'sean'
      },
      "2": {
        name: 'Chocolate chips',
        description: 'delicious',
        inventor: 'anna'
      }
    },
    recipes: [
      {
        name: 'cookies',
        instructions: 'bake',
        ingredients: [
          $ref(['ingrediesById', 1]),
          $ref(['ingrediesById', 2])
        ],
        authors: $atom(['sean', 'anna'])
      }, 
      {
        name: 'brownies',
        instructions: 'also bake them',
        ingredients: [
          {$type: 'ref', value: ['ingrediesById', 1]}
        ],
        authors: {
          $type: 'atom', value: ['jack', 'sean']
        }
      }
    ]
  }
});

/*
model
 // .get(['recipes', {from: 0, to: 1}, ['ingredients'], {from: 0, to: 9}])
  .get(
  ['recipes', {from: 0, to: 1}, 'ingredients', {from: 0, to: 1}, ["name", "description"]],
  'recipes[1].ingredients[0..9]',
  'recipes[0]["authors"]'
  )
  .then((data)=>{
    //console.log(data);
    //console.log(JSON.stringify(data, null, 4));
    let map = Immutable.fromJS(data.json);
    //console.log(map.toJSON());
  });
*/

const App = React.createClass({
  
  getInitialState() {
    return {
      recipes: []
    };
  },
  componentWillMount() {
    model
      .get(
        ['recipes', {from: 0, to: 1}, 'ingredients', {from: 0, to: 9}, Recipe.queries.recipe()],
        ['recipes', {from: 0, to: 1}, Recipe.queries.authers()]
      )
      .then((data)=>{
        console.log('xxx', JSON.stringify(data.json, null, 4));
        this.setState({
          recipes: _.values(data.json.recipes)
        });
      })
  },
  
  render: function() {
    console.log(this.state);
    return (
      <div>
        {this.state.recipes.map((recipe, index)=>{
          return (
            <Recipe key={index} {...recipe}/>
          );
        })}
      </div>
    );
  }
});

const Recipe = React.createClass({
  statics: {
    queries: {
      recipe() {
        return _.union(Ingredients.queries.recipe())
      },
      authers() {
        return Authers.queries.recipe()
      }
      
    }
  },
  
  render() {
    return (
      <div>
        <Ingredients ingredients={this.props.ingredients} />
        <Authers authors={this.props.authors}/>
      </div>
    );
  }
});

const Ingredients = React.createClass({
  statics: {
    queries: {
      recipe() {
        return ['name', 'description', 'inventor']
      }
    }
  },
  
  render() {
    return (
      <h1>{JSON.stringify(this.props.ingredients)}</h1>
    );
  }
});

const Authers = React.createClass({
  
  statics: {
    queries: {
      recipe() {
        return ['authors']
      }
    }
  },
  
  getDefaultProps() {
    return {
      authors: []
    };
  },
  
  render() {
    return (
      <ul>
        {this.props.authors.map((author, index)=>{
          return (
            <li key={`${author}-${index}`}>{author}</li>
          );
        })}
      </ul>
    );
  }
});


ReactDom.render(<App />, document.getElementById('target'));

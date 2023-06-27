import React from 'react'
import Autosuggest from 'react-autosuggest';

const SearchBox = ({symbols,setNewSymbol,newSymbol}) => {

    const [suggestions, setSuggestions] = React.useState([]);

    const getSuggestions = value => {
        const inputValue = value.trim().toLowerCase();
        const inputLength = inputValue.length;

        return inputLength === 0
            ? []
            : symbols.filter(symbol => symbol.toLowerCase().includes(inputValue));
    };


    const onSuggestionSelected = (event, { suggestion }) => {
        setNewSymbol(suggestion);
    };

    const renderSuggestion = suggestion => <div>{suggestion}</div>;

    const onSuggestionsFetchRequested = ({ value }) => {
        setSuggestions(getSuggestions(value));
    };

    const onSuggestionsClearRequested = () => {
        setSuggestions([]);
    };

    const getSuggestionValue = suggestion => suggestion;


  return (
      <Autosuggest
          suggestions={suggestions}
          onSuggestionsFetchRequested={onSuggestionsFetchRequested}
          onSuggestionsClearRequested={onSuggestionsClearRequested}
          getSuggestionValue={getSuggestionValue}
          renderSuggestion={renderSuggestion}
          inputProps={{
              placeholder: 'Type a symbol',
              value: newSymbol,
              onChange: (event, { newValue }) => {
                  setNewSymbol(newValue);
              }
          }}
          onSuggestionSelected={onSuggestionSelected}
      />
  )
}

export default SearchBox
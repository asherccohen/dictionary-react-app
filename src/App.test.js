import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import {
  validateDictionary,
  checkDuplicate,
  checkCycle,
} from './helpers/validationHelper';

const dictionaries = require('./assets/data/dictionaries.json');

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <Router>
      <App />
    </Router>,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});

describe('Validate a dictionary', () => {
  it('returns an array', () => {
    expect(Array.isArray(dictionaries.map(el => el.synonims))).toBe(true);
  });
  it('returns an array of synonims', () => {
    dictionaries.map(dictionary =>
      expect(Array.isArray(validateDictionary(dictionary.synonims))).toEqual(
        true
      )
    );
  });
  it('checks duplicate domains', () => {
    dictionaries.map(dictionary =>
      expect(
        dictionary.synonims
          .map(synonim => {
            const newArr = dictionary.synonims.filter(
              removed => removed !== synonim
            );
            return checkDuplicate(newArr, 'domain', synonim.domain);
          })
          .every(x => x)
      ).toEqual(false)
    );
  });
  it('checks duplicate ranges', () => {
    dictionaries.map(dictionary =>
      expect(
        dictionary.synonims
          .map(synonim => {
            const newArr = dictionary.synonims.filter(
              removed => removed !== synonim
            );
            return checkDuplicate(newArr, 'range', synonim.range);
          })
          .every(x => x)
      ).toEqual(false)
    );
  });
  it('checks cycles', () => {
    dictionaries.map(dictionary =>
      expect(
        dictionary.synonims
          .map(synonim => {
            const newArr = dictionary.synonims.filter(
              removed => removed !== synonim
            );
            return checkCycle(newArr, 'range', synonim.range);
          })
          .every(x => x)
      ).toEqual(false)
    );
  });
  it('checks chains', () => {
    dictionaries.map(dictionary =>
      expect(
        dictionary.synonims
          .map(synonim => {
            const newArr = dictionary.synonims.filter(
              removed => removed !== synonim
            );
            return checkCycle(newArr, 'domain', synonim.domain);
          })
          .every(x => x)
      ).toEqual(false)
    );
  });
});

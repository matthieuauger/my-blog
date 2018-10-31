import React from 'react'

import 'typeface-lora'
import 'typeface-varela-round'

import profilePic from './profile-pic.jpeg'
import { rhythm } from '../utils/typography'

class Bio extends React.Component {
  render() {
    return (
      <>
        <p>
          A simple blog about computing, lean, agile and everything useful enough to build quickly quality products.
        </p>
        <div
          style={{
            display: 'flex',
          }}
        >
          <img
            src={profilePic}
            alt={`Matthieu Auger`}
            style={{
              marginRight: rhythm(1 / 2),
              marginBottom: 0,
              width: rhythm(2),
              height: rhythm(2),
            }}
          />
          <p>
            Written by <strong>Matthieu Auger</strong> who lives and works in Paris building things.{' '}
            <a href="https://twitter.com/matthieuauger">
              You should follow him on Twitter
            </a>
          </p>
        </div>
      </>
    )
  }
}

export default Bio

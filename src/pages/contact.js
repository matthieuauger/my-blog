import React from 'react'
import get from 'lodash/get'
import Helmet from 'react-helmet'

import Layout from '../components/layout'

class BlogContact extends React.Component {
  render() {
    const siteTitle = get(this, 'props.data.site.siteMetadata.title')
    const siteDescription = get(
      this,
      'props.data.site.siteMetadata.description'
    )

    return (
      <Layout location={this.props.location}>
        <Helmet
          htmlAttributes={{ lang: 'en' }}
          meta={[{ name: 'description', content: siteDescription }]}
          meta={[{ name: 'google-site-verification', content: `dS1dBzK4q9PmadKMepSSAKRoQXumwDfisvxwRnAXP_0` }]}
          title={siteTitle}
        />
        <h1>Contact</h1>

        <form name="contact" method="POST" data-netlify-honeypot="bot-field" data-netlify="true">
          <input type="hidden" name="form-name" value="contact" />
          <p>
              <label>Name: <input type="text" name="name"></input></label>
          </p>            
          <p>
              <label>Email: <input type="email" name="email"></input></label>
          </p>

          <p>
              <label>Review message: <textarea name="message"></textarea></label>
          </p>
          <p>
              <button type="submit">Send</button>
          </p>
        </form>

      </Layout>
    )
  }
}

export default BlogContact

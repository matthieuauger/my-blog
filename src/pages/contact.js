import React from 'react'
import { Formik } from 'formik';
import get from 'lodash/get'
import Helmet from 'react-helmet'

import Layout from '../components/layout'
import Style from '../components/ContactForm/ContactForm.style';

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
        <Formik
          initialValues={{ name: '', email: '', message: '' }}
          validate={values => {
            let errors = {};
            if (!values.name) {
              errors.name = 'Required';
            }

            if (!values.email) {
              errors.email = 'Required';
            } else if (
              !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
            ) {
              errors.email = 'Invalid email address';
            }

            if (!values.message) {
              errors.message = 'Required';
            }

            return errors;
          }}
          onSubmit={(values, { setSubmitting }) => {
            setTimeout(() => {
              alert(JSON.stringify(values, null, 2));
              setSubmitting(false);
            }, 400);
          }}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
            /* and other goodies */
          }) => (
            <Style>
              <div className="container">
                <form name="contact" method="POST" data-netlify-honeypot="bot-field" data-netlify="true" onSubmit={handleSubmit}>
                  <input type="hidden" name="form-name" value="contact" />
                  <ul className="flex-outer">
                    <li>
                      <label>Email</label> 
                      <input
                        type="email"
                        name="email"
                        required
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.email}
                      />
                    </li>
                    <li>
                      <label>Name</label>
                      <input
                        type="text"
                        name="name"
                        required
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.name}
                      />
                    </li>
                    <li>
                      <label>Message</label>
                      <textarea
                        name="message"
                        required
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.message}
                      >{values.message}</textarea>
                    </li>
                    <li>
                      <button type="submit" disabled={isSubmitting}>
                        Send
                      </button>
                    </li>
                  </ul>
                </form>
              </div>
            </Style>
          )}
        </Formik>
      </Layout>
    )
  }
}

export default BlogContact

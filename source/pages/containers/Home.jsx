import React, { Component, PropTypes } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';

import Post from '../../post/containers/Post';
import Loading from '../../shared/components/Loading';
import Title from '../../shared/components/Title';


import api from '../../api';

import styles from './Page.css';

import actions from '../../actions';

class Home extends Component {

  constructor(props) {
    super(props);

    this.state = {
      loading: true,
    };

    this.handleScroll = this.handleScroll.bind(this);
  }

  async componentDidMount() {
    this.initialFetch();
    window.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  async initialFetch() {
    const posts = await api.posts.getList(this.props.page);

    this.props.dispatch(
      actions.setPost(posts),
    );

    this.setState({
      loading: false,
    });
  }

  handleScroll() {
    if (this.state.loading) return null;
    const scrolled = window.scrollY;
    // const viewportHeight = window.innerHeight;
    const fullHeight = document.body.clientHeight;

    if (!(scrolled + 300 >= fullHeight)) {
      return null;
    }

    return this.setState({ loading: true }, async () => {
      try {
        const posts = await api.posts.getList(this.props.page);

        this.props.dispatch(
          actions.setPost(posts),
        );

        this.setState({
          loading: false,
        });
      } catch (error) {
        this.setState({ loading: false });
      }
    });
  }

  render() {
    return (
      <section name="home" className={styles.section}>
        <Title>
          <FormattedMessage id="title.home" />
        </Title>

        <section className={styles.list}>
          {this.props.posts
            .map(post => <Post key={post.id} {...post} />)
          }
          {this.state.loading && (
            <Loading />
          )}
        </section>
      </section>
    );
  }
}

Home.propTypes = {
  dispatch: PropTypes.func,
  posts: PropTypes.arrayOf(PropTypes.object),
  page: PropTypes.number,
};

/* connect es un HOC por lo que se de pasar un componente
que en este caso es Home, pero antes se debe inicializar (Ejecutar como una funcion)
y una vez ejeuctada la funciona resivimos el HOC el cual le pasamos Home.

*/

// Nos permite obteter parte del estado para enviar como props a Home
function mapStateToProps(state) {
  return {
    posts: state.posts.entities,
    page: state.posts.page,
  };
}


export default connect(mapStateToProps)(Home);

import { Component } from 'react';
import logger from '../utils/logger';
import ErrorPage from '../pages/ErrorPage';

export default class RouteErrorBoundary extends Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    logger.error('Route Error Boundary:', error, info.componentStack);
  }

  render() {
    return this.state.hasError ? (
      <ErrorPage 
        error={this.state.error} 
        resetError={() => this.setState({ hasError: false })}
      />
    ) : this.props.children;
  }
}

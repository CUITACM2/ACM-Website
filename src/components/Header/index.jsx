import React, { PropTypes } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { CDN_ROOT, SiteName } from 'src/config';
import { Menu, Dropdown, Icon } from 'antd';
import './style.less';

class Header extends React.PureComponent {
  static contextTypes = {
    router: PropTypes.object,
  }

  static propTypes = {
    location: PropTypes.object,
    menus: PropTypes.array,
    dispatch: PropTypes.func,
    currentUser: PropTypes.object
  }

  static getAvatar(user) {
    if (user == null || user.avatar == null) return '';
    return CDN_ROOT + user.avatar.thumb;
  }

  constructor(props) {
    super(props);
    this.state = {
      selectedKeys: []
    };
    this.renderMenu = this.renderMenu.bind(this);
    this.renderDropdownMenu = this.renderDropdownMenu.bind(this);
    this.linkTo = ({ key, item }) => {
      console.log(key, item);
      if (item.props.direct) {
        window.location.href = key;
      } else {
        this.props.dispatch(routerRedux.push(key));
      }
    };
  }

  componentWillMount() {
    const { menus, location } = this.props;
    this.computeActiveRoute(menus, location);
  }

  componentWillReceiveProps(nextProps) {
    const { menus, location } = nextProps;
    this.computeActiveRoute(menus, location);
  }

  computeActiveRoute(menus, location) {
    for (let i = 0; i < menus.length; i += 1) {
      if (location.pathname.indexOf(menus[i].to) === 0) {
        this.setState({ selectedKeys: [menus[i].to] });
        return;
      }
    }
  }

  renderMenu() {
    return (
      <Menu
        mode="horizontal"
        style={{ lineHeight: '62px', display: 'inline-block' }}
        selectedKeys={this.state.selectedKeys} onClick={this.linkTo}
      >
        {this.props.menus.map(data => (
          <Menu.Item key={data.to} direct={data.direct}>{data.text}</Menu.Item>
        ))}
      </Menu>
    );
  }

  renderDropdownMenu() {
    const onMenuSelect = ({ key }) => {
      switch (key) {
        case 'logout':
          this.props.dispatch({ type: 'auth/logout' });
          break;
        default:
          break;
      }
    };
    return (
      <Menu onSelect={onMenuSelect}>
        <Menu.Item key="logout">注销</Menu.Item>
      </Menu>
    );
  }

  render() {
    const { currentUser } = this.props;
    return (
      <header className="layout-header">
        <div className="header-wrapper">
          <div className="header-logo">{SiteName}</div>
          {this.renderMenu()}
          {currentUser ?
            (<ul className="nav nav-right">
              <li>
                <Dropdown overlay={this.renderDropdownMenu()} trigger={['click']}>
                  <a className="ant-dropdown-link" href="#app-root">
                    <img alt="avatar" src={Header.getAvatar(currentUser)} />
                    {currentUser.display_name} <Icon type="down" />
                  </a>
                </Dropdown>
              </li>
            </ul>) : null}
        </div>
      </header>
    );
  }
}

const mapStateToProps = state => ({
  currentUser: state.user.currentUser,
});

export default connect(mapStateToProps)(Header);

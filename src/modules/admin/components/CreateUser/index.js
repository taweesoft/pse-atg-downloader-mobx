import AdminActions, { StoreActions } from 'src/modules/admin/actions'

import Button from 'src/common/components/Buttons/Button'
import Dropdown from 'src/common/components/Dropdown'
import { PRIVILEGE } from 'src/constants'
import I18n from 'src/common/I18n'
import Input from 'src/common/components/Input'
import NoticeMessage from 'src/common/components/NoticeMessage'
import React from 'react'
import Selectors from 'src/modules/admin/selectors'
import { observer } from 'mobx-react'
import stores from 'src/stores'
import styled from 'styled-components'

const Flex = styled.div`
  display: flex;
  button {
    height: 38px;
  }
  align-items: flex-end;
`

const FlexItemFillWidth = styled.div`
  flex: 1;
  margin-right: 8px;
`

@observer
class CreateUser extends React.Component {
  state = {
    user: {
      email: '',
      password: '',
      privilege: PRIVILEGE.USER,
      tel: '',
      serial_number: '',
      name: ''
    },
    dropdownText: I18n.t('admin.please.choose.site')
  }

  componentDidMount() {
    AdminActions.getSites()
  }

  componentWillUnmount() {
    StoreActions.reset('user')
  }

  handleChange = event => {
    const { name, value } = event.target
    this.setState({
      user: { ...this.state.user, ...{ [name]: value } }
    })
  }

  onClick = () => {
    AdminActions.createUser(this.state.user)
      .then(() => AdminActions.getUsers())
  }

  generatePassword = () => {
    const MAX = 999999
    const MIN = 100000
    const randomPassword = parseInt(Math.random() * (MAX - MIN) + MIN)
    this.setState({
      password: randomPassword
    })
    document.getElementsByName('password')[0].value = randomPassword
  }

  changeSite = (index, site) => {
    this.setState({
      user: { ...this.state.user, ...{ serial_number: site.serial_number }},
      dropdownText: site.name
    })
  }

  render() {
    const { sites } = stores.admin.sites
    const { user: userStore } = stores.admin
    return (
      <div className="col-xs-12 col-sm-12 col-md-7">
        <NoticeMessage store={userStore} />
        <Input label={I18n.t('common.email')} name="email" onChange={this.handleChange} />
        <br />
        <Flex>
          <FlexItemFillWidth>
            <Input label={I18n.t('common.password')} name="password" onChange={this.handleChange} />
          </FlexItemFillWidth>
          <Button className='btn' onClick={this.generatePassword}>{I18n.t('admin.auto.generate')}</Button>
        </Flex>
        <br />
        <Input label={I18n.t('common.name')} name="name" onChange={this.handleChange} />
        <br />
        <Input label={I18n.t('common.tel')} name="tel" onChange={this.handleChange} />
        <br />
        <Dropdown
          itemSelector={Selectors.getSiteName}
          id="dropdownSites"
          items={sites}
          onItemClick={this.changeSite}
          initialLabel={this.state.dropdownText}
        />
        <br />
        <Button className='btn pl-5 pr-5' onClick={this.onClick}>{I18n.t('common.create')}</Button>
      </div>
    )
  }
}

export default CreateUser
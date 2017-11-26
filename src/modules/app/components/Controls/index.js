import 'react-datepicker/dist/react-datepicker.css'

import { filterInventoryFromDate, getOnlyName } from 'src/js/utils'

import $ from 'jquery'
import Button from 'src/common/components/Button'
import DatePicker from 'react-datepicker'
import DownloadImg from 'src/assets/images/download-white.svg'
import Dropdown from 'src/common/components/Dropdown'
import React from 'react'
import Selectors from 'src/modules/app/selectors'
import _ from 'lodash'
import { downloadTypes } from 'src/constants'
import moment from 'moment'
import { observer } from 'mobx-react'
import service from 'src/js/service'
import stores from 'src/stores'

const style = {
  buttonStyle: {
    height: 38,
    padding: '.3rem 1rem'
  }
}

@observer
class Controls extends React.Component {

  constructor(props) {
    super(props)
    this.downloadTypes = [
      {
        label: 'ทุก 1 นาที',
        type: downloadTypes.EVERY
      },
      {
        label: 'ทุก 1 ชั่วโมง',
        type: downloadTypes.HOURLY
      },
      {
        label: 'ทุก 1 วัน',
        type: downloadTypes.DAILY
      }
    ]
    this.minDate = moment(_.first(props.inventories).date)
    this.maxDate = moment(_.last(props.inventories).date)
    this.state = {
      startDate: moment(_.first(props.inventories).date),
      endDate: moment(_.last(props.inventories).date)
    }

  }

  inventoryStore = stores.inventory

  changeDownloadType = (index, type) => {
    this.inventoryStore.setDownloadType(type)
  }

  downloadAll = () => {
    $('.loading-spin').removeClass('hidden')
    const { inventories } = this.props
    const { downloadType } = this.inventoryStore
    const { startDate, endDate } = this.state
    const filteredInventories = filterInventoryFromDate(inventories, startDate, endDate)
    const onlyName = getOnlyName(filteredInventories)
    stores.inventory.setDownloadingList(onlyName)

    const callback = (inventory, success) => {
      if(success)
        stores.inventory.removeDownloadQueue(inventory.name)
      else
        stores.inventory.setError(inventory.name)
    }
    
    service.downloadAllInventories(filteredInventories, callback, downloadType.type)
  }

  handleStartDateChange = (date) => {
    this.setState({
      startDate: date
    })
  }

  handleEndDateChange = (date) => {
    this.setState({
      endDate: date
    })
  }
    
  render() {
    return (
      <div className='d-flex align-items-end'>
        <Button style={style.buttonStyle} className="btn align-self-end" onClick={this.downloadAll.bind(this)}>
                    ดาวน์โหลดทั้งหมด
          <img className='ml-2' src={DownloadImg} alt="" />
        </Button>
        <Dropdown 
          itemSelector={Selectors.getDownloadTypeLabel}
          items={this.downloadTypes}
          id="dropdownDownloadTypes"
          initialLabel={this.inventoryStore.downloadType.label}
          className="ml-4"
          onItemClick={this.changeDownloadType}
        />
        <div className='ml-4'>
          <div>
            <span>เริ่ม</span>
            <DatePicker minDate={this.minDate} maxDate={this.maxDate} dateFormat='DD/MM/YYYY' className='form-control' selected={this.state.startDate} onChange={this.handleStartDateChange} />
          </div>
        </div>

        <div className='ml-4'>
          <div>
            <span>ถึง</span>
            <DatePicker minDate={this.minDate} maxDate={this.maxDate} dateFormat='DD/MM/YYYY' className='form-control' selected={this.state.endDate} onChange={this.handleEndDateChange} />
          </div>
        </div>
      </div>
    )
  }
}

export default Controls
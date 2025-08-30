import React from 'react'
import { Form, Input,DatePicker,Upload } from 'antd'


export default function registerForm() {
  return (
    <div>
      <div className="mt-3 flex w justify-center">
        <Form>
          <legend>ข้อมูลทั่วไป</legend>
          <div className="flex gap-2 mb-2">
            <Input type="text" placeholder="Fisrtname" />
            <Input type="text" placeholder="Surname" />
          </div>
          <div className="flex gap-2 mt-2 mb-2">
            <Input type="text" placeholder="เบอร์โทรศัพท์"/>
            <DatePicker className="w-full"/>
          </div>
          <Upload listType="picture-card"></Upload>
        </Form>
      </div>

    </div>
  )
}

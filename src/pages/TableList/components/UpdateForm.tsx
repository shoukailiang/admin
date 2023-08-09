import {
  ProFormRadio,
  ProFormText,
  StepsForm,
} from '@ant-design/pro-components';
import { FormattedMessage, useIntl } from '@umijs/max';
import { Modal } from 'antd';
import React from 'react';

export type FormValueType = {
  target?: string;
  template?: string;
  type?: string;
  time?: string;
  frequency?: string;
} & Partial<API.EmployeeListItem>;

export type UpdateFormProps = {
  onCancel: (flag?: boolean, formVals?: FormValueType) => void;
  onSubmit: (values: FormValueType) => Promise<void>;
  updateModalOpen: boolean;
  values: Partial<API.EmployeeListItem>;
};

const UpdateForm: React.FC<UpdateFormProps> = (props) => {
  const intl = useIntl();
  return (
    <StepsForm
      stepsProps={{
        size: 'small',
      }}
      stepsFormRender={(dom, submitter) => {
        return (
          <Modal
            width={640}
            bodyStyle={{ padding: '32px 40px 48px' }}
            destroyOnClose
            title={intl.formatMessage({
              id: 'pages.employeeManagement.title',
              defaultMessage: '员工管理',
            })}
            open={props.updateModalOpen}
            footer={submitter}
            onCancel={() => {
              props.onCancel();
            }}
          >
            {dom}
          </Modal>
        );
      }}
      onFinish={props.onSubmit}
    >
      <StepsForm.StepForm
        initialValues={{
          ...props.values,
        }}
        title={intl.formatMessage({
          id: 'pages.searchTable.updateForm.basicConfig',
          defaultMessage: '基本信息',
        })}
      >
      <ProFormText
        disabled
        label="id"
          width="md"
          name="id"
        />
        <ProFormText
        label="员工账号"
          rules={[
            {
              required: true,
              message: (
                <FormattedMessage
                  id="pages.employeeManagement.employeeAccount"
                  defaultMessage="username is required"
                />
              ),
            },
          ]}
          width="md"
          name="username"
        />
          <ProFormText
          label="员工姓名"
          rules={[
            {
              required: true,
              message: (
                <FormattedMessage
                  id="pages.employeeManagement.employeeName"
                  defaultMessage="name is required"
                />
              ),
            },
          ]}
          width="md"
          name="name"
        />
        <ProFormText
          label="手机号"
          rules={[
            {
              required: true,
              message: (
                <FormattedMessage
                  id="pages.employeeManagement.employeePhone"
                  defaultMessage="phone is required"
                />
              ),
            },
          ]}
          width="md"
          name="phone"
        />
        <ProFormRadio.Group
            name="sex"
            rules={[
              {
                required: true,
                message: '性别不能为空',
              },
            ]}
            label="性别"
            options={[
              {
                label: '女',
                value: '0',
              },
              {
                label: '男',
                value: '1',
              },
            ]}
          />
          <ProFormText
          label="身份证"
          rules={[
            {
              required: true,
              message: "身份证号码不能为空",
            },
          ]}
          width="md"
          name="idNumber"
        />
      </StepsForm.StepForm>
    </StepsForm>
  );
};

export default UpdateForm;

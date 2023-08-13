import {
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
} & Partial<API.CategoryListItem>;

export type UpdateFormProps = {
  onCancel: (flag?: boolean, formVals?: FormValueType) => void;
  onSubmit: (values: FormValueType) => Promise<void>;
  updateModalOpen: boolean;
  values: Partial<API.CategoryListItem>;
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
            title={"编辑"}
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
        label="分类名称"
          rules={[
            {
              required: true,
              message: (
                <FormattedMessage
                  id="pages.categoryManagement.categoryName"
                  defaultMessage="username is required"
                />
              ),
            },
          ]}
          width="md"
          name="name"
        />
          <ProFormText
          label="排序"
          rules={[
            {
              required: true,
              message: (
                <FormattedMessage
                  id="pages.categoryManagement.sort"
                  defaultMessage="name is required"
                />
              ),
            },
          ]}
          width="md"
          name="sort"
        />
      </StepsForm.StepForm>
    </StepsForm>
  );
};

export default UpdateForm;

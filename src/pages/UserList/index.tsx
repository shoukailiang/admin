import { addUser, removeRule, employee, updateUser } from '@/services/ant-design-pro/api';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns, ProDescriptionsItemProps } from '@ant-design/pro-components';
import {
  FooterToolbar,
  ModalForm,
  PageContainer,
  ProDescriptions,
  ProFormRadio,
  ProFormText,
  ProTable,
} from '@ant-design/pro-components';
import { FormattedMessage, useIntl } from '@umijs/max';
import { Button, Drawer, message } from 'antd';
import React, { useRef, useState } from 'react';
import type { FormValueType } from './components/UpdateForm';
import UpdateForm from './components/UpdateForm';

/**
 * @en-US Add node
 * @zh-CN 添加用户,点击添加按钮的时候
 * @param fields
 */
const handleAdd = async (fields: API.EmployeeListItem) => {
  const hide = message.loading('正在添加');
  try {
    await addUser({ ...fields });
    hide();
    message.success('Added successfully');
    return true;
  } catch (error) {
    hide();
    message.error('Adding failed, please try again!');
    return false;
  }
};

/**
 * @en-US Update node
 * @zh-CN 更新节点
 *
 * @param fields
 */
const handleUpdate = async (fields: FormValueType) => {
  const hide = message.loading('Configuring');
  try {
    await updateUser({...fields});
    hide();

    message.success('Configuration is successful');
    return true;
  } catch (error) {
    hide();
    message.error('Configuration failed, please try again!');
    return false;
  }
};

/**
 *  Delete node
 * @zh-CN 删除节点
 *
 * @param selectedRows
 */
const handleRemove = async (selectedRows: API.EmployeeListItem[]) => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;
  try {
    await removeRule({
      id: selectedRows.map((row) => row.id),
    });
    hide();
    message.success('Deleted successfully and will refresh soon');
    return true;
  } catch (error) {
    hide();
    message.error('Delete failed, please try again');
    return false;
  }
};


// disable or enable user
const DisableOrEnableUser = async (fields:API.EmployeeListItem)=>{
  const hide = message.loading('Configuring');
  try {
    await updateUser({
      id: fields.id,
      status: fields.status===0?1:0,
    });
    hide();

    message.success('Configuration is successful');
    return true;
  } catch (error) {
    hide();
    message.error('Configuration failed, please try again!');
    return false;
  }
}

const UserList: React.FC = () => {
  /**
   * @en-US Pop-up window of new window
   * @zh-CN 新建窗口的弹窗
   *  */
  const [createModalOpen, handleModalOpen] = useState<boolean>(false);
  /**
   * @en-US The pop-up window of the distribution update window
   * @zh-CN 更新窗口的弹窗
   * */
  const [updateModalOpen, handleUpdateModalOpen] = useState<boolean>(false);

  const [showDetail, setShowDetail] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.EmployeeListItem>();
  const [selectedRowsState, setSelectedRows] = useState<API.EmployeeListItem[]>([]);

  /**
   * @en-US International configuration
   * @zh-CN 国际化配置
   * */
  const intl = useIntl();

  const columns: ProColumns<API.EmployeeListItem>[] = [
    {
      title: (
        <FormattedMessage
          id="pages.employeeManagement.employeeName"
          defaultMessage="Rule name"
        />
      ),
      dataIndex: 'name',
      tip: '姓名',
      render: (dom, entity) => {
        return (
          <a
            onClick={() => {
              setCurrentRow(entity);
              setShowDetail(true);
            }}
          >
            {dom}
          </a>
        );
      },
    },
    {
      title: <FormattedMessage id="pages.employeeManagement.employeeAccount" defaultMessage="Description" />,
      dataIndex: 'username',
      valueType: 'textarea',
    },
    {
      title: (
        <FormattedMessage
          id="pages.employeeManagement.employeePhone"
          defaultMessage="Number of service calls"
        />
      ),
      dataIndex: 'phone',
      hideInForm: true,
    },
    {
      title: <FormattedMessage id="pages.employeeManagement.accountStatus" defaultMessage="Status" />,
      dataIndex: 'status',
      hideInForm: true,
      valueEnum: {
        0: {
          text: (
            <FormattedMessage
              id="pages.employeeManagement.accountStatus.freeze"
              defaultMessage="Shut down"
            />
          ),
          status: 'Default',
        },
        1: {
          text: (
            <FormattedMessage id="pages.employeeManagement.accountStatus.normal" defaultMessage="Running" />
          ),
          status: 'Processing',
        },
        2: {
          text: (
            <FormattedMessage id="pages.searchTable.nameStatus.online" defaultMessage="Online" />
          ),
          status: 'Success',
        },
        3: {
          text: (
            <FormattedMessage
              id="pages.searchTable.nameStatus.abnormal"
              defaultMessage="Abnormal"
            />
          ),
          status: 'Error',
        },
      },
    },
    {
      title: <FormattedMessage id="pages.searchTable.titleOption" defaultMessage="Operating" />,
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a
          key="config"
          onClick={() => {
            handleUpdateModalOpen(true);
            setCurrentRow(record);
          }}
        >
          <FormattedMessage id="pages.employeeManagement.edit" defaultMessage="Configuration" />
        </a>,
        <a key="" style={{color:record.status===1?'red':'green'}} onClick={()=>{
          DisableOrEnableUser(record);
          if(actionRef.current){
            actionRef.current.reload();
          }
        }}>
          {record.status===0?<FormattedMessage id="pages.employeeManagement.enable" defaultMessage="Enable" />:<FormattedMessage id="pages.employeeManagement.disable" defaultMessage="Disable" />}
        </a>,
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<API.EmployeeListItem, API.PageParams>
        headerTitle={intl.formatMessage({
          id: 'pages.employeeManagement.title',
          defaultMessage: 'Enquiry form',
        })}
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          // 新建的
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              handleModalOpen(true);
            }}
          >
            <PlusOutlined /> <FormattedMessage id="pages.searchTable.new" defaultMessage="New" />
          </Button>,
        ]}
        request={employee}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
          },
        }}
      />
      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              <FormattedMessage id="pages.searchTable.chosen" defaultMessage="Chosen" />{' '}
              <a style={{ fontWeight: 600 }}>{selectedRowsState.length}</a>{' '}
              <FormattedMessage id="pages.searchTable.item" defaultMessage="项" />
              &nbsp;&nbsp;
              <span>
                <FormattedMessage
                  id="pages.searchTable.totalServiceCalls"
                  defaultMessage="Total number of service calls"
                />{' '}
                <FormattedMessage id="pages.searchTable.tenThousand" defaultMessage="万" />
              </span>
            </div>
          }
        >
          <Button
            onClick={async () => {
              await handleRemove(selectedRowsState);
              setSelectedRows([]);
              actionRef.current?.reloadAndRest?.();
            }}
          >
            <FormattedMessage
              id="pages.searchTable.batchDeletion"
              defaultMessage="Batch deletion"
            />
          </Button>
          <Button type="primary">
            <FormattedMessage
              id="pages.searchTable.batchApproval"
              defaultMessage="Batch approval"
            />
          </Button>
        </FooterToolbar>
      )}
      <ModalForm
        title={intl.formatMessage({
          id: 'pages.user.addUser',
          defaultMessage: 'New user',
        })}
        width="400px"
        open={createModalOpen}
        onOpenChange={handleModalOpen}
        onFinish={async (value) => {
          const success = await handleAdd(value as API.EmployeeListItem);
          if (success) {
            handleModalOpen(false);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
      >
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
      </ModalForm>
      <UpdateForm
        onSubmit={async (value) => {
          const success = await handleUpdate(value);
          if (success) {
            handleUpdateModalOpen(false);
            setCurrentRow(undefined);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        onCancel={() => {
          handleUpdateModalOpen(false);
          if (!showDetail) {
            setCurrentRow(undefined);
          }
        }}
        updateModalOpen={updateModalOpen}
        values={currentRow || {}}
      />

      <Drawer
        width={600}
        open={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable={false}
      >
        {currentRow?.name && (
          <ProDescriptions<API.EmployeeListItem>
            column={2}
            title={currentRow?.name}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.name,
            }}
            columns={columns as ProDescriptionsItemProps<API.EmployeeListItem>[]}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default UserList;

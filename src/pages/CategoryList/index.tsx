import { addCategoryDish, removeRule, category, updateCategory } from '@/services/ant-design-pro/api';
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
 * @zh-CN 添加类别
 * @param fields
 */
const handleAdd = async (fields: API.CategoryListItem) => {
  const hide = message.loading('正在添加');
  try {
    await addCategoryDish({ ...fields });
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
 * @zh-CN 更新类别
 *
 * @param fields
 */
const handleUpdate = async (fields: FormValueType) => {
  const hide = message.loading('Configuring');
  try {
    await updateCategory({...fields});
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
 * @zh-CN 删除类别
 *
 * @param selectedRows
 */
const handleRemove = async (selectedRows: API.CategoryListItem[]) => {
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
const DeleteCategory = async (fields:API.CategoryListItem)=>{
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

const CategoryList: React.FC = () => {
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
          id="pages.categoryManagement.categoryName"
          defaultMessage="Rule name"
        />
      ),
      dataIndex: 'name',
      tip: '分类名称',
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
      title: <FormattedMessage id="pages.categoryManagement.categoryType" defaultMessage="Description" />,
      dataIndex: 'type',
      // ==1 现实菜品分类，==2显示套餐分类
      renderText: (val) => val===1?'菜品分类':'套餐分类',
    },
    {
      title: (
        <FormattedMessage
          id="pages.categoryManagement.operationTime"
          defaultMessage="pages.categoryManagement.operationTime"
        />
      ),
      dataIndex: 'updateTime',
    },
    {
      title: <FormattedMessage id="pages.categoryManagement.sort" defaultMessage="sort" />,
      dataIndex: 'sort',
      hideInForm: true,
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
          <FormattedMessage id="pages.categoryManagement.edit" defaultMessage="edit" />
        </a>,
        <a key="" style={{color:'red'}} onClick={()=>{
          DeleteCategory(record);
          if(actionRef.current){
            actionRef.current.reload();
          }
        }}>
          <FormattedMessage id="pages.categoryManagement.delete" defaultMessage="delete" />
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
        request={category}
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

export default CategoryList;

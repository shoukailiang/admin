import {
  getSetMealList,
  removeSeatMeal,
  updateSeatMeal,
  updateSeatMealStatusBatch,
} from '@/services/ant-design-pro/api';
import type { ActionType, ProColumns, ProDescriptionsItemProps } from '@ant-design/pro-components';
import {
  FooterToolbar,
  ModalForm,
  PageContainer,
  ProDescriptions,
  ProTable,
} from '@ant-design/pro-components';
import { FormattedMessage, useIntl, useNavigate } from '@umijs/max';
import { Button, Drawer, Image, message, Modal } from 'antd';
import React, { useRef, useState } from 'react';

/**
 *  Delete node
 * @zh-CN 批量删除套餐
 *
 * @param selectedRows
 */
const handleRemoveBatch = async (selectedRows: API.DishListItem[]) => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;
  try {
    await removeSeatMeal({
      ids: selectedRows.map((row) => row.id),
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

const DeleteSeatMeal = async (fields: API.SetMealListItem) => {
  const hide = message.loading('Configuring');
  try {
    await removeSeatMeal({
      ids: fields.id,
    });
    hide();

    return true;
  } catch (error) {
    hide();
    message.error('Configuration failed, please try again!');
    return false;
  }
};

const SetMealList: React.FC = () => {
  const nav = useNavigate();
  /**
   * @en-US Pop-up window of new window
   * @zh-CN 新建窗口的弹窗
   *  */
  const [createModalOpen, handleModalOpen] = useState<boolean>(false);

  const [showDetail, setShowDetail] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.DishListItem>();
  const [selectedRowsState, setSelectedRows] = useState<API.DishListItem[]>([]);

  /**
   * @en-US International configuration
   * @zh-CN 国际化配置
   * */
  const intl = useIntl();

  const [record, setRecord] = useState<API.DishListItem>({});

  // 模态框
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = useState('你确定删除该套餐吗？');

  const showModal = () => {
    setOpen(true);
  };

  const handleOk = () => {
    setModalText('你确定删除分类吗？');
    // setConfirmLoading(true);
    DeleteSeatMeal(record);
    actionRef.current?.reloadAndRest?.();
    setRecord({});
    setOpen(false);
    // setConfirmLoading(false);
  };

  const handleCancel = () => {
    console.log('Clicked cancel button');
    setOpen(false);
    setRecord({});
  };

  /**
   * @en-US Update node
   * @zh-CN 更新dish状态
   */
  const handleUpdateStatus = async (fields: API.SetMealListItem) => {
    const hide = message.loading('Configuring');
    try {
      await updateSeatMealStatusBatch(
        {
          ids: `${fields.id}`,
        },
        fields.status === 0 ? 1 : 0
      );
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
   * @en-US Update node
   * @zh-CN 批量dish状态
   */
  const handleUpdateStatusBatch = async (selectedRows: API.SetMealListItem[], type: number) => {
    const hide = message.loading('Configuring');
    try {
      await updateSeatMealStatusBatch(
        {
          ids: selectedRows.map((row) => row.id),
        },
        type,
      );
      hide();

      message.success('Configuration is successful');
      return true;
    } catch (error) {
      hide();
      message.error('Configuration failed, please try again!');
      return false;
    }
  };


  const columns: ProColumns<API.DishListItem>[] = [
    {
      title: "套餐名称",
      dataIndex: 'name',
      tip: '套餐名称',
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
      // 图片
      title: '套餐图片',
      dataIndex: 'image',
      // img src 拼接上http://162.14.124.240:8080/common/download?name=，然后大小小一点
      renderText: (val: string) => (
        <Image src={'http://162.14.124.240:8080/common/download?name=' + val} width={100} />
      ),
    },
    {
      title: '套餐分类',
      dataIndex: 'categoryName',
    },
    {
      title: '套餐价格',
      dataIndex: 'price',
      // 价格除以100，前面加上人民币符号
      renderText: (val: number) => `￥${val / 100}`,
    },
    {
      // 售卖状态
      title: '售卖状态',
      dataIndex: 'status',
      // 1是起售 2是停售，不用国际化
      valueEnum: {
        1: { text: '起售', status: 'Success' },
        0: { text: '停售', status: 'Error' },
      },
    },
    {
      // 最后操作时间
      title: (
        <FormattedMessage
          id="pages.dishManagement.lastOperationTime"
          defaultMessage="最后操作时间"
        />
      ),
      dataIndex: 'updateTime',
    },
    {
      title: <FormattedMessage id="pages.searchTable.titleOption" defaultMessage="Operating" />,
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a
          key="config"
          onClick={() => {
            nav(`/seatmeal/add/${record.id}`)
            // handleUpdateModalOpen(true);
            // setCurrentRow(record);
          }}
        >
          {/* 修改 */}
          <FormattedMessage id="pages.dishManagement.edit" defaultMessage="update" />
        </a>,
        <a
          key="modify"
          onClick={() => {
            handleModalOpen(true);
            setCurrentRow(record);
          }}
        >
          {record.status === 0 ? '起售' : '停售'}
        </a>,
        <a
          key="delete"
          style={{ color: 'red' }}
          onClick={() => {
            showModal();
            setRecord(record);
          }}
        >
          <FormattedMessage id="pages.categoryManagement.delete" defaultMessage="delete" />
        </a>,
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<API.SetMealListItem, API.PageParams>
        headerTitle={intl.formatMessage({
          id: 'pages.dishManagement.title',
          defaultMessage: 'Enquiry form',
        })}
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              nav("/seatmeal/add/new")
            }}
          >
            新建套餐
          </Button>,
        ]}
        request={getSetMealList}
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
            </div>
          }
        >
          <Button
            onClick={async () => {
              await handleRemoveBatch(selectedRowsState);
              setSelectedRows([]);
              actionRef.current?.reloadAndRest?.();
            }}
          >
            <FormattedMessage
              id="pages.searchTable.batchDeletion"
              defaultMessage="Batch deletion"
            />
          </Button>
          <Button
            type="primary"
            onClick={async () => {
              await handleUpdateStatusBatch(selectedRowsState, 1);
              setSelectedRows([]);
              actionRef.current?.reloadAndRest?.();
            }}
          >
            批量启用
          </Button>
          <Button
            type="primary"
            onClick={async () => {
              await handleUpdateStatusBatch(selectedRowsState, 0);
              setSelectedRows([]);
              actionRef.current?.reloadAndRest?.();
            }}
          >
            批量停售
          </Button>
        </FooterToolbar>
      )}
      <ModalForm
        title={'确定改变状态吗'}
        width="400px"
        open={createModalOpen}
        onOpenChange={handleModalOpen}
        onFinish={async () => {
          const success = await handleUpdateStatus(currentRow || {});
          if (success) {
            handleModalOpen(false);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
      ></ModalForm>

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
          <ProDescriptions<API.DishListItem>
            column={2}
            title={currentRow?.name}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.name,
            }}
            columns={columns as ProDescriptionsItemProps<API.DishListItem>[]}
          />
        )}
      </Drawer>
      {/* model框 */}
      <Modal
        title="Title"
        open={open}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <p>{modalText}</p>
      </Modal>
    </PageContainer>
  );
};

export default SetMealList;

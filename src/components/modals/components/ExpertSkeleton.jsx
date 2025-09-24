import { Card, Skeleton } from 'antd';
import { SPACING } from '../constants/styleConstants';

/**
 * 达人卡片骨架屏组件
 */
export const ExpertSkeleton = () => (
  <Card style={{ borderRadius: '12px', marginBottom: SPACING.large }}>
    <div style={{ display: 'flex', gap: SPACING.large }}>
      <Skeleton.Avatar size={64} active />
      <div style={{ flex: 1 }}>
        <Skeleton active>
          <Skeleton.Input style={{ width: '200px', height: '20px' }} active />
          <Skeleton.Input style={{ width: '150px', height: '16px', marginTop: SPACING.small }} active />
          <div style={{ marginTop: SPACING.medium }}>
            <Skeleton.Button size="small" active style={{ marginRight: SPACING.small }} />
            <Skeleton.Button size="small" active style={{ marginRight: SPACING.small }} />
            <Skeleton.Button size="small" active />
          </div>
          <div style={{
            backgroundColor: '#f5f5f5',
            padding: SPACING.medium,
            borderRadius: '8px',
            marginTop: SPACING.medium
          }}>
            <Skeleton.Input style={{ width: '100%', height: '16px' }} active />
            <Skeleton.Input style={{ width: '80%', height: '14px', marginTop: SPACING.small }} active />
          </div>
          <Skeleton.Button
            style={{ width: '100%', height: '40px', marginTop: SPACING.medium }}
            active
          />
        </Skeleton>
      </div>
    </div>
  </Card>
);
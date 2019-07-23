
import { shallowMount } from '@vue/test-utils';
import Attachment from '../index.vue';

describe('Attachment.vue', () => {
    // 测试内容: props
    // 自定义props传递到Attachment组件，判断组件是否有获取到props
    it('props test', () => {
        // expect('213').toEqual('213');
        // const renderer = crea
        const attchmentProps = {
            employeeId: '123',
            visible: true,
            attachmentList: ['213'],
            employeePropertyId: '456',
            pathName: '测试',
            keyName: '测试关键',
        };
        const wrapper = shallowMount(Attachment, {
            propsData: attchmentProps,
        });
        expect(wrapper.props().employeeId).toBe('123');
        // 每一个it最后销毁wrapper
        wrapper.destroy();
    });
})
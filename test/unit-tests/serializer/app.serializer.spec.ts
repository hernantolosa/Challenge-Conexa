import { UserRole } from '@app/users/enums/roles.enum';
import { AppSerializer, Serializable } from '@app/serializers/app.serializer';
describe('Serializable', () => {
  class TestSerializable extends Serializable<{ data: string }> {
    serialize(roles: UserRole[]) {
      if (roles.includes(UserRole.ADMIN)) {
        return { data: 'admin' };
      }
      return { data: 'user' };
    }
  }

  it('should properly serialize based on role', () => {
    const instance = new TestSerializable({ data: 'test' });
    expect(instance.serialize([UserRole.ADMIN])).toEqual({ data: 'admin' });
    expect(instance.serialize([UserRole.REGULAR])).toEqual({ data: 'user' });
  });
});

describe('AppSerializer - applyRoleBasedSerialization', () => {
  let appSerializer: AppSerializer;

  beforeEach(() => {
    appSerializer = new AppSerializer();
  });

  it('should serialize an array of Serializable instances', () => {
    class TestArraySerializable extends Serializable<{ data: string }> {
      serialize() {
        return { data: this.get().data + '-serialized' };
      }
    }

    const testData = [
      new TestArraySerializable({ data: 'one' }),
      new TestArraySerializable({ data: 'two' })
    ];

    const result = appSerializer.applyRoleBasedSerialization(testData, [UserRole.ADMIN]);
    expect(result).toEqual([{ data: 'one-serialized' }, { data: 'two-serialized' }]);
  });

  it('should serialize an object with Serializable properties', () => {
    class TestObjectSerializable extends Serializable<{ data: string }> {
      serialize() {
        return { data: this.get().data + '-serialized' };
      }
    }

    const testData = {
      first: new TestObjectSerializable({ data: 'one' }),
      second: new TestObjectSerializable({ data: 'two' })
    };

    const result = appSerializer.applyRoleBasedSerialization(testData, [UserRole.ADMIN]);
    expect(result).toEqual({ first: { data: 'one-serialized' }, second: { data: 'two-serialized' } });
  });

  it('should serialize a mix of Serializable and plain objects', () => {
    class TestMixedSerializable extends Serializable<{ data: string }> {
      serialize() {
        return { data: this.get().data + '-serialized' };
      }
    }

    const testData = {
      serializable: new TestMixedSerializable({ data: 'one' }),
      plain: { data: 'two' }
    };

    const result = appSerializer.applyRoleBasedSerialization(testData, [UserRole.ADMIN]);
    expect(result).toEqual({ serializable: { data: 'one-serialized' }, plain: { data: 'two' } });
  });
});


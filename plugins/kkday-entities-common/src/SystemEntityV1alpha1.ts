import {
  Entity,
  entityKindSchemaValidator,
  KindValidator,
} from '@backstage/catalog-model';
import schema from './System.v1alpha1.schema.json';

/**
 * Backstage catalog Template kind Entity. Templates are used by the Scaffolder
 * plugin to create new entities, such as Components.
 *
 * @public
 */
export interface SystemEntityV1alpha1 extends Entity {
  /**
   * The apiVersion string of the TaskSpec.
   */
  apiVersion: 'backstage.io/v2alpha1';
  /**
   * The kind of the entity
   */
  kind: 'System';
  /**
   * The specification of the Template Entity
   */
  spec: {
    owner: string;
    domains?: string[];
  };
}

const validator = entityKindSchemaValidator(schema);

/**
 * Entity data validator for {@link TemplateEntityV1beta3}.
 *
 * @public
 */
export const SystemEntityV1alpha1Validator: KindValidator = {
  async check(data: Entity) {
    return validator(data) === data;
  },
};

/**
 * Typeguard for filtering entities and ensuring v1beta3 entities
 * @public
 */
export const isSystemEntityV2alpha1 = (
  entity: Entity,
): entity is SystemEntityV1alpha1 =>
  entity.apiVersion === 'kkday.com/v1alpha1' &&
  entity.kind === 'System';

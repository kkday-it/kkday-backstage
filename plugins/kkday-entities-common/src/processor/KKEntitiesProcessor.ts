import {
  Entity,
  getCompoundEntityRef,
  parseEntityRef,
  RELATION_PART_OF,
  RELATION_HAS_PART,
} from '@backstage/catalog-model';
import {
  CatalogProcessor,
  CatalogProcessorEmit,
  processingResult,
} from '@backstage/plugin-catalog-node';
import { LocationSpec } from '@backstage/plugin-catalog-common';
import {
  SystemEntityV1alpha1, SystemEntityV1alpha1Validator,
} from '@internal/plugin-kkday-entities-common';

/**
 * Adds support for scaffolder specific entity kinds to the catalog.
 *
 * @public
 */
export class KKEntitiesProcessor implements CatalogProcessor {
  getProcessorName(): string {
    return 'KKEntitiesProcessor';
  }

  private readonly validators = [SystemEntityV1alpha1Validator];

  async validateEntityKind(entity: Entity): Promise<boolean> {
    for (const validator of this.validators) {
      if (await validator.check(entity)) {
        return true;
      }
    }

    return false;
  }

  async postProcessEntity(
    entity: Entity,
    _location: LocationSpec,
    emit: CatalogProcessorEmit,
  ): Promise<Entity> {
    const selfRef = getCompoundEntityRef(entity);

    if (
      entity.apiVersion === 'kkday.com/v1alpha1' &&
      entity.kind === 'System'
    ) {
      const system = entity as SystemEntityV1alpha1;

      const targets = system.spec.domains;
      if (targets) {
        for (const target of targets ) {
          const targetRef = parseEntityRef(target, {
            defaultKind: 'Domain',
            defaultNamespace: selfRef.namespace,
          });
          emit(
            processingResult.relation({
              source: selfRef,
              type: RELATION_PART_OF,
              target: {
                kind: targetRef.kind,
                namespace: targetRef.namespace,
                name: targetRef.name,
              },
            }),
          );
          emit(
            processingResult.relation({
              source: {
                kind: targetRef.kind,
                namespace: targetRef.namespace,
                name: targetRef.name,
              },
              type: RELATION_HAS_PART,
              target: selfRef,
            }),
          );
        }
      }
    }

    return entity;
  }
}

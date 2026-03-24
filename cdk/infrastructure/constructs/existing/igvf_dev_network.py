"""
Dev VPC wiring for igvf-ui.

Pinned ``shared-infrastructure`` (v1.5.3) ships an older ``DemoNetwork`` that
only uses ``Vpc.from_lookup`` for ``vpc-0a06e5b3b690b554b``, which CDK classifies without
public subnets—breaking ``ApplicationLoadBalancedFargateService``. This module
matches current ``shared-infrastructure`` mainline: optional
``igvfDemoVpcAttributes`` in ``cdk.json`` and default lookup VPC
``vpc-04c8432aa0425779b``.
"""
from constructs import Construct

from aws_cdk.aws_ec2 import Vpc

from typing import Any
from typing import Dict
from typing import List
from typing import Optional
from typing import cast


def _explicit_vpc_props_from_context(scope: Construct) -> Optional[Dict[str, Any]]:
    """
    Optional App context key ``igvfDemoVpcAttributes`` bypasses ``Vpc.from_lookup`` so
    subnet *types* match what stacks need (public ALB + isolated RDS) even when lookup
    mis-classifies subnets (e.g. missing IGW routes or stripped CDK tags).
    """
    raw = scope.node.try_get_context('igvfDemoVpcAttributes')
    if raw is None:
        return None
    if not isinstance(raw, dict):
        raise ValueError('igvfDemoVpcAttributes context must be an object')
    required = ('vpcId', 'availabilityZones', 'publicSubnetIds', 'isolatedSubnetIds')
    missing = [k for k in required if k not in raw]
    if missing:
        raise ValueError(f'igvfDemoVpcAttributes missing keys: {missing}')
    azs = raw['availabilityZones']
    pub = raw['publicSubnetIds']
    iso = raw['isolatedSubnetIds']
    if not (isinstance(azs, list) and isinstance(pub, list) and isinstance(iso, list)):
        raise ValueError(
            'igvfDemoVpcAttributes: availabilityZones, publicSubnetIds, isolatedSubnetIds '
            'must be lists'
        )
    return {
        'vpc_id': cast(str, raw['vpcId']),
        'availability_zones': cast(List[str], azs),
        'public_subnet_ids': cast(List[str], pub),
        'isolated_subnet_ids': cast(List[str], iso),
    }


class DemoNetwork(Construct):

    def __init__(self, scope: Construct, construct_id: str, **kwargs: Any) -> None:
        super().__init__(scope, construct_id, **kwargs)
        explicit = _explicit_vpc_props_from_context(self)
        if explicit is not None:
            self.vpc = Vpc.from_vpc_attributes(
                self,
                'DemoVpc',
                vpc_id=explicit['vpc_id'],
                availability_zones=explicit['availability_zones'],
                public_subnet_ids=explicit['public_subnet_ids'],
                isolated_subnet_ids=explicit['isolated_subnet_ids'],
            )
        else:
            self.vpc = Vpc.from_lookup(
                self,
                'DemoVpc',
                vpc_id='vpc-04c8432aa0425779b'
            )

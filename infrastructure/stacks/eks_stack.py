# =============================================================================
# EKS STACK — DISABLED
# Switched to Fargate. Kept as reference only.
# To re-enable: uncomment import and instantiation in app.py.
# Cost warning: NAT Gateway (~$32/mo) + EC2 t3.small node (~$15/mo)
# =============================================================================

# from aws_cdk import (
#     Stack,
#     aws_eks as eks,
#     aws_ec2 as ec2,
#     aws_iam as iam,
# )
# from aws_cdk.lambda_layer_kubectl_v31 import KubectlV31Layer
# from constructs import Construct
#
#
# class EksStack(Stack):
#     def __init__(self, scope: Construct, construct_id: str, **kwargs):
#         super().__init__(scope, construct_id, **kwargs)
#
#         # VPC — EKS cluster will run here
#         self.vpc = ec2.Vpc(
#             self, "PixoraEksVPC",
#             max_azs=2,
#             nat_gateways=1,  # EKS worker nodes need NAT to pull images
#         )
#
#         # IAM role for EKS cluster
#         cluster_role = iam.Role(
#             self, "PixoraEksClusterRole",
#             assumed_by=iam.ServicePrincipal("eks.amazonaws.com"),
#             managed_policies=[
#                 iam.ManagedPolicy.from_aws_managed_policy_name("AmazonEKSClusterPolicy"),
#             ]
#         )
#
#         # EKS Cluster
#         self.cluster = eks.Cluster(
#             self, "PixoraEksCluster",
#             cluster_name="pixora-eks",
#             version=eks.KubernetesVersion.V1_31,
#             kubectl_layer=KubectlV31Layer(self, "KubectlLayer"),
#             vpc=self.vpc,
#             role=cluster_role,
#             default_capacity=0,  # we'll add node group separately
#         )
#
#         # Node group — EC2 instances that run our pods
#         self.cluster.add_nodegroup_capacity(
#             "PixoraNodeGroup",
#             instance_types=[ec2.InstanceType("t3.small")],
#             min_size=1,
#             max_size=3,
#             desired_size=1,
#         )

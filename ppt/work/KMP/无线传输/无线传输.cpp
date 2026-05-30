#include<iostream>
#include<cstring>
using namespace std;
const int N=1000005;
int len[N],n,m;
char A[N];

void Prepare(){
	len[1]=0;
	int cur=0;
	for(int i=2;i<=n;i++){
		while(cur&&A[cur+1]!=A[i])
			cur=len[cur];
		if(A[cur+1]==A[i])len[i]=++cur;
		else len[i]=0;
	}
} 

int main(){
	scanf("%d%s",&n,A+1);
	Prepare();
	cout<<n-len[n]; 
	return 0;
}


#include<bits/stdc++.h>
using namespace std;
const int N=4e4+10;
int n,f[N];
int main(){
	cin>>n;
	f[1]=1;
	if(n==1){
		cout<<1<<'\n';
		return 0;
	}
	for(int i=2;1;i++){
		f[i]=f[i-1]+1;
		for(int j=1;i-2*j-5>=1;j++) f[i]=max(f[i],f[i-2*j-5]*(j+1));
		if(f[i]>=n){
			cout<<i;
			return 0;
		}
	}
	return 0;
}